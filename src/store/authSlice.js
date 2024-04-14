import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history from "../util/history";
import { userAuth } from "../util/auth";

// check if the user data is present in the local storage
const storedAuthData = localStorage.getItem("authData");

let initialState = {
  user: null,
  token: null,
};

if (storedAuthData) {
  initialState = JSON.parse(storedAuthData);
}

const extraActions = createExtraActions();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state, { payload }) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("authData");
      history.navigate(payload.sendTo, { replace: true });
    },
  },
  extraReducers: (builder) => {
    // adding reducers to handle the auth flow loading, fullfilled and rejected states
    builder.addCase(
      extraActions.authenticate.fulfilled,
      (state, { payload }) => {
        // if the auth was successful, set the state and set the local storage
        state.user = payload.data.user;
        state.token = payload.data.token;

        localStorage.setItem(
          "authData",
          JSON.stringify({
            user: payload.data.user,
            token: payload.data.token,
          })
        );

        history.navigate(history.location.state?.from || "/", {
          replace: true,
        });
      }
    );

    builder.addCase(extraActions.authenticate.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(extraActions.authenticate.rejected, (state, { error }) => {
      state.error = error?.info?.message || "Unable to authenticate.";
    });
  },
});

// creating a async thunk for authentication
function createExtraActions() {
  return {
    authenticate: authenticate(),
  };

  function authenticate() {
    return createAsyncThunk(
      `$users/authenticate`,
      async ({ mode, userData }) => {
        return await userAuth({ mode, userData });
      }
    );
  }
}

export const authReducer = authSlice.reducer;

export const authActions = {
  ...authSlice.actions,
  ...extraActions,
};
