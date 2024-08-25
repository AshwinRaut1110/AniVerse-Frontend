import React from "react";
import EpisodeCreator from "../components/Anime/Episode/EpisodeCreator";

function AddNewEpisodePage() {
  return (
    <div className="p-5 pt-7">
      <h1 className="text-center text-3xl sm:text-5xl font-bold font-[Lato]">
        <span className="text-[#007bff]">The Episode</span>{" "}
        <span className="text-orange-500">Studio</span>
      </h1>

      <EpisodeCreator />
    </div>
  );
}

export default AddNewEpisodePage;
