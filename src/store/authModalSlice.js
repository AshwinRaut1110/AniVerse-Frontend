import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: "login",
  modalIsShown: false,
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    showModal(state) {
      state.modalIsShown = true;
    },
    hideModal(state) {
      state.modalIsShown = false;
    },
    changeCurrentPage(state, { payload }) {
      if (!state.modalIsShown) state.modalIsShown = true;
      state.currentPage = payload;
    },
  },
});

export const authModalReducer = authModalSlice.reducer;

export const authModalActions = authModalSlice.actions;
