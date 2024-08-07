import React from "react";
import {
  applyCharacterLimit,
  capitalize,
  formatAiredDate,
} from "../../util/misc";
import Dot from "../UI/Dot";
import { Link } from "react-router-dom";
import { BookmarkIcon, PlayIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function AnimeCard({ anime, relation }) {
  let aired;

  if (anime.status === "not yet aired") {
    aired = capitalize(anime.status);
  }

  if (anime.aired?.startDate) {
    aired = formatAiredDate(anime.aired.startDate);
  }

  const handleAddToWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(anime._id);
  };

  return (
    <Link to={`/animes/${anime._id}`}>
      <motion.div
        className={`group relative ${
          relation === "current" ? "border-2 border-orange-500" : ""
        } pb-2 hover:border-none`}
        initial={{
          scale: 1,
        }}
        whileHover={{
          scale: 1.05,
          transition: {
            type: "spring",
          },
        }}
      >
        <img src={anime.thumbnail} alt={anime.names.english} />

        {/* group-hover:invisible */}
        <div className=" pt-2 px-2 group-hover:pb-2">
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
            {relation && <span>{anime.duration}</span>}
          </span>
        </div>

        {/* bg-[rgba(33,33,33,0.8)] group-hover:block */}
        <div className="hidden absolute top-0 w-full h-full font-[Lato] p-2 space-y-1 md:space-y-2">
          <h4 className="text-white text-[0.5rem] md:text-xs lg:text-base">
            {anime.names.english}
          </h4>

          <p className="text-white text-[0.5rem] md:text-xs lg:text-base">
            {Number(anime.averageRating).toFixed(1)} ⭐ ({anime.ratingsQuantity}
            )
          </p>

          <p className="text-white text-[0.5rem] md:text-xs lg:text-sm line-clamp-4">
            {anime.description}
          </p>

          <div className="space-y-1">
            <p className="text-[0.5rem] md:[0.6rem] lg:text-sm">
              <span className="text-gray-400">Aired: </span>
              <span className="text-gray-100">{aired}</span>
            </p>

            <p className="text-[0.5rem] md:[0.6rem] lg:text-sm">
              <span className="text-gray-400">Status: </span>
              <span className="text-gray-100">{anime.status}</span>
            </p>

            <p className="text-[0.5rem] md:[0.6rem] lg:text-sm">
              <span className="text-gray-400">Episodes: </span>
              <span className="text-gray-100">{anime.episodes}</span>
            </p>

            <p className="text-[0.5rem] md:[0.6rem] lg:text-sm">
              <span className="text-gray-400">Genres: </span>
              <span className="text-gray-100">{anime.genres.join(", ")}</span>
            </p>
          </div>

          <div className="absolute flex items-center space-x-3 left-0 bottom-0 py-1 px-1 w-full text-white">
            <PlayIcon
              className="text-blue-base h-7"
              title={`watch ${anime.names.english}`}
            />

            <BookmarkIcon
              className="text-blue-base h-6"
              title={`add ${anime.names.english} to your watchlist`}
              onClick={handleAddToWatchlist}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default AnimeCard;
