import { configureStore } from '@reduxjs/toolkit';
import authReducer from './ducks/authSlice';
import { loadAuthState, saveAuthState } from './utils/localStorage';

// Load persisted auth state from localStorage (if available)
const preloadedState = {
  auth: loadAuthState() || {
    token: null,
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

// Subscribe to store updates to save the auth slice to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveAuthState(state.auth);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
