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
import AddNewEpisodePage from "./pages/AddNewEpisodePage.jsx";
import EditEpisodePage from "./pages/EditEpisodePage.jsx";
import EpisodePage from "./pages/EpisodePage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import HomePage from "./pages/HomePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
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
            children: [
              {
                path: "",
                element: <EditAnimePage />,
              },
              {
                path: "episodes",
                element: <AddNewEpisodePage />,
              },
              {
                path: "episodes/:episodeIdentifier",
                element: <EditEpisodePage />,
              },
            ],
          },
        ],
      },
      {
        path: "animes",
        children: [
          {
            path: ":animeId",
            children: [
              { path: "", element: <AnimePage /> },
              { path: ":episodeIdentifier", element: <EpisodePage /> },
            ],
          },
        ],
      },
      {
        path: "browse",
        element: <BrowsePage />,
      },
    ],
  },
  ,
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </Provider>
  // </React.StrictMode>
);
