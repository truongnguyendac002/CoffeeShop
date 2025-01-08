import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import forgotPasswordReducer from "./forgotPasswordSlice";
import cartReducer from "./cartSlice";
import favoritesReducer from './favoritesSlice ';
import shippingAddressReducer  from './shippingAddressSlice ';

export const store = configureStore({
  reducer: {
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart : cartReducer,
    favorites: favoritesReducer,
    shippingAddresses: shippingAddressReducer ,
  },
});
