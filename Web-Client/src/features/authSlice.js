// src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false, // Initially, the user is not authenticated
  user: null, // Holds user info after login
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // Store user info (e.g., token, username)
      localStorage.setItem('authToken', action.payload.token); // Save token to localStorage
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('authToken'); // Clear token from localStorage
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        state.isAuthenticated = true;
        state.user = { token }; // Optionally, store more user info
      }
    },
  },
});

export const { login, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
