import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { authModalReducer } from "./authModalSlice";

const store = configureStore({
  reducer: { auth: authReducer, authModal: authModalReducer },
});

export default store;
