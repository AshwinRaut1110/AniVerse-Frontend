import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./store/store.js";
import ProfilePage from "./pages/ProfilePage.jsx";
import AddNewAnimePage from "./pages/addNewAnimePage.jsx";
import { queryClient } from "./util/http.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "profile", element: <ProfilePage /> },
      {
        path: "anime",
        children: [
          {
            path: "new",
            element: <AddNewAnimePage />,
          },
        ],
      },
    ],
  },
  ,
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
