import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  productData: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  totalPrice: localStorage.getItem("totalPrice")
    ? parseFloat(localStorage.getItem("totalPrice"))
    : 0,
};


const roundPrice = (price) => {
  const fixed = Number(price);
  return isNaN(fixed) ? 0 : parseFloat(fixed.toFixed(2));
};

export const productCart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addTocart: (state, action) => {
      const originalItem = action.payload;

      const exists = state.productData.find(
        (product) => product._id === originalItem._id
      );

      if (exists) {
        toast.error("Item is already in your cart");
        return;
      }

      const rawPrice = Number(originalItem.price);
      const discount = Number(originalItem.discount) || 0;

      const discountedPrice = rawPrice - (rawPrice * discount) / 100;
      const safePrice = roundPrice(discountedPrice);

      const item = {
        ...originalItem,
        discountedPrice: safePrice,
      };

      state.productData.push(item);
      state.totalPrice = roundPrice(state.totalPrice + safePrice);

      localStorage.setItem("cart", JSON.stringify(state.productData));
      localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
      toast.success("Item successfully added to your cart");
    },

    removeFromCart: (state, action) => {
      const item = action.payload;

      const productToRemove = state.productData.find(
        (product) => product._id === item._id
      );

      if (productToRemove) {
        state.productData = state.productData.filter(
          (product) => product._id !== item._id
        );

        const safePrice = Number(productToRemove.discountedPrice) || 0;
        state.totalPrice = roundPrice(state.totalPrice - safePrice);

        localStorage.setItem("cart", JSON.stringify(state.productData));
        localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
        toast.error("Item removed from your cart");
      }
    },

    resetcart: (state) => {
      state.productData = [];
      state.totalPrice = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("totalPrice");
      toast.error("Cart has been reset successfully");
    },
  },
});

export const { addTocart, removeFromCart, resetcart } = productCart.actions;
export default productCart.reducer;
