import { combineReducers } from '@reduxjs/toolkit';

// Initial state for app
const initialState = {
  user: null,
  loading: false,
  error: null
};

// Simple app reducer
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app: appReducer,
});

export default rootReducer;