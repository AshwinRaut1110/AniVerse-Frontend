import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getEpisodeData, queryClient } from "../util/http";
import EpisodeCreator from "../components/Anime/Episode/EpisodeCreator";
import NyanLoader from "../components/UI/NyanLoader";
import ErrorComponent from "../components/UI/ErrorComponent";

function EditEpisodePage() {
  const { episodeIdentifier, animeId } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["animes", animeId, "episodes", episodeIdentifier],
    queryFn: ({ signal }) => getEpisodeData(episodeIdentifier, animeId, signal),
  });

  const handleHideError = () => {
    queryClient.resetQueries({
      queryKey: ["animes", animeId, "episodes", episodeIdentifier],
      exact: true,
    });
  };

  return (
    <div className="p-5 pt-7">
      <h1 className="text-center text-3xl sm:text-5xl font-bold font-[Lato]">
        <span className="text-[#007bff]">The Episode</span>{" "}
        <span className="text-orange-500">Studio</span>
      </h1>
      {isError && (
        <ErrorComponent
          errors={error.info.message}
          onHideError={handleHideError}
        />
      )}
      {isPending && <NyanLoader className="h-28 m-auto mt-20" />}
      {data && <EpisodeCreator existingEpisodeData={data.data?.episode} />}
    </div>
  );
}

export default EditEpisodePage;
