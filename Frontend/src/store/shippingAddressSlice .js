import { createSlice } from '@reduxjs/toolkit';

const SHIPPING_ADDRESS_KEY = "shipping-address";

const initialState = {
  addresses: JSON.parse(localStorage.getItem(SHIPPING_ADDRESS_KEY) || "[]").map((item) => ({
    ...item,
    selected : item.selected || false ,
  }))
};

const shippingAddressSlice = createSlice({
  name: 'shippingAddresses',
  initialState,
  reducers: {
    setAddresses(state, action) {
      state.addresses = action.payload;
      localStorage.setItem(SHIPPING_ADDRESS_KEY, JSON.stringify(state.addresses));
    },
    addAddress(state, action) {
      state.addresses.push(action.payload);
      localStorage.setItem(SHIPPING_ADDRESS_KEY, JSON.stringify(state.addresses));
    },
    updateAddress(state, action) {
      const index = state.addresses.findIndex((addr) => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      localStorage.setItem(SHIPPING_ADDRESS_KEY, JSON.stringify(state.addresses));
    },
    deleteAddress(state, action) {
      state.addresses = state.addresses.filter((addr) => addr.id !== action.payload.id);
      localStorage.setItem(SHIPPING_ADDRESS_KEY, JSON.stringify(state.addresses));
    },
    toggleSelectedAddress(state, action) {
        const addressId = action.payload;
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          selected: addr.id === addressId,
        }));
        localStorage.setItem(SHIPPING_ADDRESS_KEY, JSON.stringify(state.addresses));
      },
      clearAddress: (state) => {
        state.addresses = [];
        localStorage.removeItem(SHIPPING_ADDRESS_KEY);
      },
  },
});

export const { setAddresses, addAddress, updateAddress, deleteAddress , toggleSelectedAddress , clearAddress} = shippingAddressSlice.actions;
export default shippingAddressSlice.reducer;
