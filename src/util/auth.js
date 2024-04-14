export async function userAuth({ mode, userData }) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/users/${mode || "login"}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    const error = new Error(errorResponse.message);
    error.code = response.status;
    throw error;
  }

  return await response.json();
}
