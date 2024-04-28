import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  success: {
    show: false,
    message: "",
  },
  error: {
    show: false,
    message: "",
  },
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showSuccessNotification(state, { payload }) {
      state.error.show = false;
      state.success.show = true;
      state.success.message = payload.message;
    },
    hideSuccessNotification(state) {
      state.success.show = false;
    },
    showErrorNotification(state, { payload }) {
      state.success.show = false;
      state.error.show = true;
      state.error.message = payload.message;
    },
    hideErrorNotification(state) {
      state.error.show = false;
    },
  },
});

export const notificationReducer = notificationSlice.reducer;

export const notificationActions = notificationSlice.actions;
