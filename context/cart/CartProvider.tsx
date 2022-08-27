import { FC, useReducer, PropsWithChildren, useEffect } from "react";
import { ICartProduct, IOrder, shippingAddress } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import Cookie from "js-cookie";
import { tesloAPI } from "../../api";
import axios from "axios";

export interface CartState {
  cart: ICartProduct[];
  isLoaded: boolean;
  numberOfItems: number;
  Subtotal: number;
  tax: number;
  total: number;
  shippingAddress?: shippingAddress;
}

const Cart_INITIAL_STATE: CartState = {
  cart: Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : [],
  isLoaded: false,
  numberOfItems: 0,
  Subtotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, Cart_INITIAL_STATE);

  //efecto
  useEffect(() => {
    try {
      const cookie = Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : [];
      dispatch({
        type: "[CART] - loadCart from cookies | storage",
        payload: cookie,
      });
    } catch (error) {
      dispatch({
        type: "[CART] - loadCart from cookies | storage",
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (Cookie.get("firstName") !== undefined) {
      const address: shippingAddress = {
        firstName: Cookie.get("firstName") || "",
        lastName: Cookie.get("lastName") || "",
        address: Cookie.get("address") || "",
        address2: Cookie.get("address2") || "",
        zip: Cookie.get("zip") || "",
        city: Cookie.get("city") || "",
        country: Cookie.get("country") || "",
        phone: Cookie.get("phone") || "",
      };
      dispatch({
        type: "[CART] - cart-address-form-cookies",
        payload: address,
      });
    }
  }, []);

  useEffect(() => {
    if (state.cart.length >= 0) Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const Subtotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      Subtotal,
      tax: Subtotal * taxRate,
      total: Subtotal * (taxRate + 1),
    };
    dispatch({ type: "[CART] - update-order-summary", payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    // dispatch({type: '[CART] - add product', payload: product}) solucion fallida

    const productInCart = state.cart.some((p) => p._id === product._id);

    if (!productInCart)
      return dispatch({
        type: "[CART] - act-product-cart",
        payload: [...state.cart, product],
      });

    const productInCartDifSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );
    if (!productInCartDifSize)
      return dispatch({
        type: "[CART] - act-product-cart",
        payload: [...state.cart, product],
      });

    //acumular
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;
      //actualizar cantidad
      p.quantity += product.quantity;

      return p;
    });
    dispatch({ type: "[CART] - act-product-cart", payload: updatedProducts });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[CART] - change-product-quantity", payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "[CART] - remove-product-cart", payload: product });
  };

  const loadAddressFromCookies = (address: shippingAddress) => {
    dispatch({ type: "[CART] - cart-address-form-cookies", payload: address });
  };
  const updateAddress = (address: shippingAddress) => {
    Cookie.set("firstName", address.firstName);
    Cookie.set("lastName", address.lastName);
    Cookie.set("address", address.address);
    Cookie.set("address2", address.address2 || "");
    Cookie.set("zip", address.zip);
    Cookie.set("city", address.city);
    Cookie.set("country", address.country);
    Cookie.set("phone", address.phone);
    dispatch({ type: "[CART] - update-address", payload: address });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error("no hay direccion de entrega");
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      Subtotal: state.Subtotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };
    try {
      const {data} = await tesloAPI.post("/orders", body);
      //todo dispatch
      dispatch({type: "[CART] - cart-order-complete"})

      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {

        return {
          hasError: true,
          // @ts-ignore
          message: error.response?.data.message
        };
      }
      return {
        hasError: true,
        message: "error no controlado, consulte con el administrador",
      };
    }
  };
  return (
    <CartContext.Provider
      value={{
        ...state,

        //methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        loadAddressFromCookies,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
