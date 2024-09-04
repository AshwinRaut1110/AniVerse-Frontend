import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getEpisodesForAnAnime } from "../../../util/http";
import { applyCharacterLimit } from "../../../util/misc";

function EpisodesList({ pageNumber, episodesPerPage }) {
  // fetch the episode list for the active page

  const { animeId } = useParams();

  const { data } = useQuery({
    queryKey: ["animes", animeId, "page", pageNumber],
    queryFn: ({ signal }) =>
      getEpisodesForAnAnime({
        animeId,
        page: pageNumber,
        limit: episodesPerPage,
        signal,
      }),
    staleTime: Infinity,
  });

  return (
    <div className="flex flex-col items-center w-full min-h-[30rem]">
      {data &&
        data.data.episodes.map((episode, index) => (
          <Link
            key={episode._id}
            to={`/animes/${animeId}/${episode.episodeNumber}`}
            className={`flex items-center pr-3 pl-5 space-x-4 w-[95%] h-10 text-[0.85rem] text-gray-500 font-[Lato] font-bold ${
              index % 2 == 0 ? "bg-[#111111]" : "bg-[#191919]"
            } shadow-md border border-[#212121] cursor-pointer`}
          >
            <span>{episode.episodeNumber}</span>
            <span className="w-[100%] whitespace-nowrap overflow-hidden text-ellipsis">
              {episode.title.english}
            </span>
          </Link>
        ))}
    </div>
  );
}

export default EpisodesList;
