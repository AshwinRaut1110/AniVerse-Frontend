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
import EditAnimePage from "./pages/editAnimePage.jsx";
import { queryClient } from "./util/http.js";
import AnimePage from "./pages/AnimePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "profile", element: <ProfilePage /> },
      {
        path: "studio",
        children: [
          {
            path: "",
            element: <AddNewAnimePage />,
          },
          {
            path: ":animeId",
            element: <EditAnimePage />,
          },
        ],
      },
      {
        path: "animes",
        children: [
          {
            path: ":animeId",
            element: <AnimePage />,
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
