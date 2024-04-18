import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { authModalReducer } from "./authModalSlice";
import { notificationReducer } from "./NotificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    authModal: authModalReducer,
    notification: notificationReducer,
  },
});

export default store;
