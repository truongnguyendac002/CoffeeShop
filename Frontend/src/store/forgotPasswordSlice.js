import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState : {
        email :  Cookies.get('email') || "" ,
    }, 
    reducers : {
        setEmail(state , action) {
            state.email = action.payload;
            Cookies.set('email', action.payload, { expires: 15 / 1440 });
        },
        clearEmail(state) {
            state.email = '';
            Cookies.remove('email');
          },
    }
})

export const { setEmail, clearEmail } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;