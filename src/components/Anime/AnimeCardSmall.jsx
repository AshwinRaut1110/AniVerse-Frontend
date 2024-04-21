import React from "react";
import { applyCharacterLimit, capitalize } from "../../util/misc";
import Dot from "../UI/Dot";
import { Link } from "react-router-dom";

function AnimeCardSmall({ anime, relation }) {
  return (
    <Link to={`/animes/${anime._id}`}>
      <div
        className={`${
          relation === "current" ? "border-2 border-orange-500" : ""
        } pb-2`}
      >
        <img src={anime.thumbnail} alt={anime.names.english} />

        <div className="pt-2 px-2">
          <h4 className="text-[0.5rem] sm:text-xs md:text-sm lg:text-base font-[Lato] font-bold text-white">
            {applyCharacterLimit(anime.names.english, 25)}
          </h4>

          <span className="flex items-center space-x-1 md:space-x-2 text-gray-400 font-[Lato] text-[0.5rem] sm:text-xs md:text-sm lg:text-base">
            {relation && (
              <>
                {relation && <span>{capitalize(relation)}</span>}
                <Dot />
              </>
            )}
            {relation && <span>{anime.type}</span>}
            <Dot />
            {relation && <span>{anime.duration}m</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AnimeCardSmall;
