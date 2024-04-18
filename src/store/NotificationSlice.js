import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  success: {
    show: false,
    title: "",
    message: "",
  },
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showSuccessNotification(state, { payload }) {
      state.success.show = true;
      state.success.title = payload.title;
      state.success.message = payload.message;
    },
    hideSuccessNotification(state) {
      state.success.show = false;
    },
  },
});

export const notificationReducer = notificationSlice.reducer;

export const notificationActions = notificationSlice.actions;
