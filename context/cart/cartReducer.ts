import { ICartProduct, shippingAddress } from "../../interfaces";
import { CartState } from "./";

type CartType =
  | {
      type: "[CART] - loadCart from cookies | storage";
      payload: ICartProduct[];
    }
  | {
      type: "[CART] - act-product-cart";
      payload: ICartProduct[];
    }
  | {
      type: "[CART] - cart-address-form-cookies";
      payload: shippingAddress;
    }
  | {
      type: "[CART] - update-address";
      payload: shippingAddress;
    }
  | {
      type: "[CART] - change-product-quantity";
      payload: ICartProduct;
    }
  | {
      type: "[CART] - remove-product-cart";
      payload: ICartProduct;
    }
  | {
      type: "[CART] - cart-order-complete";
    }
  | {
      type: "[CART] - update-order-summary";
      payload: {
        numberOfItems: number;
        Subtotal: number;
        tax: number;
        total: number;
      };
    };

export const cartReducer = (state: CartState, action: CartType): CartState => {
  switch (action.type) {
    case "[CART] - loadCart from cookies | storage":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case "[CART] - act-product-cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    case "[CART] - change-product-quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          product.quantity = action.payload.quantity;
          return action.payload;
        }),
      };
    case "[CART] - remove-product-cart":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            product._id !== action.payload._id ||
            product.size !== action.payload.size
        ),
      };
    case "[CART] - update-order-summary":
      return {
        ...state,
        ...action.payload,
      };
    case "[CART] - update-address":
    case "[CART] - cart-address-form-cookies":
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case "[CART] - cart-order-complete":
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        Subtotal: 0,
        tax: 0,
        total: 0,
      };

    default:
      return state;
  }
};
