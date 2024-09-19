import { Fragment } from "react";
import BrowsePageResultCard from "../Anime/AnimeCards/BrowsePageResultCard";

function AnimeGrid({ pages }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
      {pages.map((page, index) => (
        <Fragment key={index}>
          {page.data.animes.map((anime) => (
            <BrowsePageResultCard anime={anime} key={anime._id} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}

export default AnimeGrid;
