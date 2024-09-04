import React from "react";
import { Link } from "react-router-dom";
import { applyCharacterLimit } from "../../util/misc";
import Dot from "../UI/Dot";
import { StarIcon } from "@heroicons/react/24/solid";

function AnimeCardSmall({ anime }) {
  return (
    <Link
      to={`/animes/${anime._id}`}
      className="flex w-full text-white shadow-md bg-[#191919] border border-[#222222] h-28 rounded-md cursor-pointer space-x-4"
    >
      <img
        src={anime.thumbnail}
        className="h-full rounded-tl-md rounded-bl-md"
        alt="anime thumbnail"
      />
      <div className="flex flex-col h-full pt-3 space-y-3">
        <span className="text-gray-300 text-sm font-semibold font-[Lato] break-words max-w-[225px]">
          {applyCharacterLimit(anime.names.english, 50)}
        </span>
        <span className="flex items-center text-gray-500 text-sm font-semibold font-[Lato] break-words max-w-[225px] space-x-2">
          <span>{anime.type}</span>
          <Dot />
          <span>{anime.totalEpisodes || anime.episodes} Eps</span>
          <span className="flex items-center">
            <StarIcon className="text-[#FFBC0B] h-6 mr-2" />
            {anime.averageRating.toFixed(1)}
          </span>
        </span>
      </div>
    </Link>
  );
}

export default AnimeCardSmall;
