import React from "react";
import { useNavigate } from "react-router-dom";
import { applyCharacterLimit } from "../../util/misc";
import Dot from "../UI/Dot";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const charLimit = {
  xs: 30,
  sm: 60,
  md: 150,
  lg: 40,
  xl: 60,
};
function SearchBarResultCard({ anime, onSearchResultClicked }) {
  const { windowSize } = useWindowDimensions();

  return (
    <div
      className="flex items-center w-full text-white shadow-md bg-[#191919] border border-[#222222] h-28 rounded-md cursor-pointer space-x-4 p-2"
      onClick={() => onSearchResultClicked(anime)}
    >
      <img
        src={anime.thumbnail}
        className="h-full rounded-tl-md rounded-bl-md"
        alt="anime thumbnail"
      />
      <div className="flex flex-col h-full">
        <div className="flex flex-col w-full space-y-1">
          <span className="text-gray-300 font-semibold text-sm sm:text-base font-[Lato] w-full">
            {applyCharacterLimit(anime.names.english, charLimit[windowSize])}
          </span>
          <span className="text-gray-400 text-sm font-semibold font-[Lato] w-full">
            {applyCharacterLimit(anime.names.japanese, charLimit[windowSize])}
          </span>
        </div>

        <span className="flex items-center text-gray-500 text-sm font-semibold font-[Lato] space-x-2 mt-3">
          <span>{anime.premiered.season + " " + anime.premiered.year}</span>
          <Dot />
          <span>{anime.type}</span>
          <Dot />
          <span>{anime.duration}m</span>
        </span>
      </div>
    </div>
  );
}

export default SearchBarResultCard;
