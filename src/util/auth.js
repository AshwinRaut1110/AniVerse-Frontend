export async function userAuth({ mode, userData }) {
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/users/${mode || "login"}`,
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
