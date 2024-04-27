import { authActions } from "../store/authSlice";
import store from "../store/store";
import { QueryClient } from "@tanstack/react-query";

// create anime mutation
export async function createAnime(formData) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/animes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    }
  );

  return await handleResponse(response);
}

// update anime mutation
export async function updateAnime({ formData, animeId }) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/animes/${animeId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    }
  );

  return await handleResponse(response);
}

export async function getAnimeDetailsById(animeId, signal, populate) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/animes/${animeId}${
      populate ? "?populate=true" : ""
    }`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  return await handleResponse(response);
}

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

export async function getUserReview(animeId, signal) {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/v1/animes/${animeId}/reviews/my-review`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  return await handleResponse(response);
}

export async function updateAReview({ review, animeId, reviewIsNew }) {
  let url = `${import.meta.env.VITE_API_URL}/api/v1/animes/${animeId}/reviews`;

  if (!reviewIsNew) url += "/my-review";

  const method = reviewIsNew ? "POST" : "PATCH";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(review),
  });

  return await handleResponse(response);
}

export const queryClient = new QueryClient();
