import React, { useRef } from "react";
import { capitalize, formatAiredDate } from "../../../util/misc";
import Dot from "../../UI/Dot";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function BrowsePageResultCard({ anime }) {
  let aired;

  if (anime.status === "not yet aired") {
    aired = capitalize(anime.status);
  }

  if (anime.aired?.startDate) {
    aired = formatAiredDate(anime.aired.startDate);
  }

  return (
    <Link to={`/animes/${anime._id}`}>
      <motion.div className="relative pb-2 hover:border-none rounded-md">
        <img src={anime.banner} alt={anime.names.english} loading="eager" />

        <div className="pt-2 px-2 group-hover:pb-2">
          <h4 className="text-[0.5rem] sm:text-xs md:text-sm lg:text-base font-[Lato] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
            {anime.names.english}
          </h4>

          <span className="flex items-center space-x-1 md:space-x-2 text-gray-400 font-[Lato] text-[0.5rem] sm:text-xs md:text-sm lg:text-base">
            <span>{anime.type}</span>
            <Dot />
            <span>{anime.duration}m</span>
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export default BrowsePageResultCard;
