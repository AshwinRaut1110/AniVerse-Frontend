import { authActions } from "../store/authSlice";
import store from "../store/store";
import { QueryClient } from "@tanstack/react-query";

// get multiple animes
export async function getAnimes(url, signal) {
  const response = await fetch(url, { signal });

  return await handleResponse(response);
}

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
const handleResponse = async (response, wasDeleteRequest) => {
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

  return wasDeleteRequest ? null : await response.json();
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

export const REVIEWPAGELIMIT = 2;

export async function getAllReviewsForAnAnime(
  animeId,
  reviewPageNumber,
  signal
) {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/v1/animes/${animeId}/reviews?page=${reviewPageNumber}&limit=${REVIEWPAGELIMIT}`,
    {
      signal,
    }
  );

  return await handleResponse(response);
}

export async function addReviewVote({ animeId, reviewId, type }) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/animes/${animeId}/reviews/${reviewId}/${type}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return await handleResponse(response);
}

export async function addEpisode(episodeData) {
  const url = `${import.meta.env.VITE_API_URL}/api/v1/animes/${
    episodeData.anime
  }/episodes`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(episodeData),
  });

  return await handleResponse(response);
}

export async function updateEpisode(episodeData) {
  console.log(episodeData._id);

  const url = `${import.meta.env.VITE_API_URL}/api/v1/animes/${
    episodeData.anime
  }/episodes/${episodeData._id}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(episodeData),
  });

  return await handleResponse(response);
}

export async function getEpisodeData(episodeIdentifier, animeId, signal) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/animes/${animeId}/episodes/${episodeIdentifier}`;

  const response = await fetch(url, { signal });

  return await handleResponse(response);
}

export async function getEpisodesForAnAnime({ animeId, page, limit, signal }) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/animes/${animeId}/episodes?page=${page}&limit=${limit}&sort=episodeNumber`;

  const response = await fetch(url, { signal });

  return await handleResponse(response);
}

export async function uploadEpisodeVariant({
  episodeIdentifier,
  animeId,
  variantData,
  variant,
}) {
  console.log(variant);

  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/animes/${animeId}/episodes/upload/${episodeIdentifier}?variant=${variant}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: variantData,
  });

  return await handleResponse(response);
}

export async function deleteEpisodeVariant({
  episodeIdentifier,
  animeId,
  variant,
}) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/animes/${animeId}/episodes/delete/${episodeIdentifier}?quality=${variant}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return await handleResponse(response, true);
}

export async function getComments({
  episodeId,
  signal,
  sort,
  pageParam,
  limit,
}) {
  let url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/episodes/${episodeId}/comments?page=${pageParam}&limit=${limit}`;

  if (sort) url += `&sort=${sort}`;

  const response = await fetch(url, { signal });

  return await handleResponse(response);
}

export async function createAComment({ comment, episodeId }) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/episodes/${episodeId}/comments`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });

  return await handleResponse(response);
}

export async function updateAComment({ comment, episodeId, commentId }) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/episodes/${episodeId}/comments/${commentId}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });

  return await handleResponse(response);
}

export async function likeAComment({ commentId, episodeId }) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/episodes/${episodeId}/comments/${commentId}/like`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return await handleResponse(response);
}

export async function dislikeAComment({ commentId, episodeId }) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/episodes/${episodeId}/comments/${commentId}/dislike`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return await handleResponse(response);
}

export async function findUserLike({ signal, commentId, episodeId }) {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/v1/episodes/${episodeId}/comments/${commentId}/getlike`;

  const response = await fetch(url, {
    signal,
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return await handleResponse(response);
}

export const queryClient = new QueryClient();
