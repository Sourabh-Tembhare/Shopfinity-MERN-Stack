import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth";
import { profileSlice } from "./slices/profile";
import { productEditSlice } from "./slices/productEdit";
import { productCart } from "./slices/cart";


export const store  = configureStore({
reducer:{
      auth:authSlice.reducer,
      profile:profileSlice.reducer,
      product:productEditSlice.reducer,
      cart:productCart.reducer,
}
})