import store from "../store/store";
import { QueryClient } from "@tanstack/react-query";

const getAuthToken = () => {
  return store.getState().auth.token?.token;
};

// common response handler function
const handleResponse = async (response) => {
  if (!response.ok) {
    // check for 401 and 403 status codes, and if the user is logged in if yes the user should be logged out
    if ([401, 403].includes(response.status) && getAuthToken()) {
      // log the user out
      store.dispatch(authActions.logout());
    }

    const error = new Error("Some error occurred");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
};

export const queryClient = new QueryClient();
