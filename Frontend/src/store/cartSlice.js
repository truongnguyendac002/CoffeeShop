import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: (() => {
    try {
      return JSON.parse(localStorage.getItem("cart-item-list")) || [];
    } catch (error) {
      console.error("Failed to parse localStorage data:", error);
      return [];
    }
  })().map((item) => ({
    ...item,
    isSelected: item.isSelected || false,
  })),
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = { ...action.payload, isSelected: false };

      const productItemIndex = state.items.findIndex(
        (item) => item.id === newItem.id
      );

      if (productItemIndex >= 0) {
        state.items[productItemIndex].quantity = newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      localStorage.setItem("cart-item-list", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      localStorage.setItem("cart-item-list", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart-item-list");
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      localStorage.setItem("cart-item-list", JSON.stringify(action.payload));
    },
    toggleSelected: (state, action) => {
      const { itemId, isSelected } = action.payload;
    
      if (itemId ) {
        const itemIndex = state.items.findIndex((item) => item.quantity <= item.productItemResponse.stock && item.id === itemId);
        if (itemIndex >= 0) {
          state.items[itemIndex].isSelected = !state.items[itemIndex].isSelected;
          localStorage.setItem("cart-item-list", JSON.stringify(state.items));
        }
      } else if (isSelected !== undefined) {
       
        state.items.forEach((item) => {
          if(item.quantity <= item.productItemResponse.stock){
            item.isSelected = isSelected; 
          }
        });
        localStorage.setItem("cart-item-list", JSON.stringify(state.items));
      }
    }
    
  },
});

export const { addToCart, clearCart, setCartItems, toggleSelected , removeFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
