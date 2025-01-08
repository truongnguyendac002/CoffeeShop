import { createSlice } from '@reduxjs/toolkit';

const loadFavoritesFromLocalStorage = () => {
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites) {
    try {
      return JSON.parse(savedFavorites);
    } catch (error) {
      console.error("Lỗi khi parse dữ liệu từ localStorage:", error);
      return [];
    }
  }
  return [];
};

const initialState = {
  items: loadFavoritesFromLocalStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      state.items.push(action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.items)); 
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem('favorites');
    },
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
  
      localStorage.setItem('favorites', JSON.stringify(state.items));
    },
    setFavorites: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('favorites', JSON.stringify(state.items)); 
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites, clearFavorites } = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.items;

export default favoritesSlice.reducer;