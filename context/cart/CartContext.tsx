import { createContext } from "react";
import { ICartProduct, shippingAddress } from "../../interfaces";

interface ContextProps {
  cart: ICartProduct[];
  isLoaded: boolean;
  numberOfItems: number;
  Subtotal: number;
  tax: number;
  total: number;

  shippingAddress?: shippingAddress
  //methods
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  loadAddressFromCookies: (address: shippingAddress) => void
  updateAddress: (address: shippingAddress) => void
  createOrder: () => Promise<{
    hasError: boolean;
    message: string ;
}>
}

export const CartContext = createContext({} as ContextProps);
