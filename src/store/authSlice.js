import { createSlice } from "@reduxjs/toolkit";

const storedAuthData = localStorage.getItem("auth");

let initialState = {
  user: null,
  token: null,
};

if (storedAuthData) {
  initialState = JSON.parse(storedAuthData);
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: "",
  extraReducers: "",
});
