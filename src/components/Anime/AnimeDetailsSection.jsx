import { capitalize, formatAiredDate } from "../../util/misc";
import { Rating } from "react-simple-star-rating";
import CollapsableContent from "../UI/DisplayText/CollapsableContent";

function AnimeDetailsSection({ anime, averageRating }) {
  let aired;

  if (anime.status === "not yet aired") {
    aired = capitalize(anime.status);
  }

  if (anime.aired?.startDate && !anime.aired?.endDate) {
    aired = formatAiredDate(anime.aired.startDate);
  }

  if (anime.aired?.startDate && anime.aired?.endDate) {
    aired = `${formatAiredDate(anime.aired.startDate)} to ${formatAiredDate(
      anime.aired.endDate
    )}`;
  }

  return (
    <div className="flex flex-col w-full px-5">
      {/* title section */}
      <div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[Lato] font-bold text-white">
          {anime.names.english}
        </h3>
        <h3 className="text-sm sm:text-md md:text-lg lg:text-xl font-[Lato] font-bold text-gray-300">
          {anime.names.japanese}
        </h3>
      </div>

      {/* description */}
      <CollapsableContent
        content={anime.description}
        contentColor="text-gray-400"
        shadowColor="bg-[rgb(18,18,18,0.5)]"
      />

      <div className="flex items-center mt-1 md:mt-4 space-x-0 md:space-x-3">
        <Rating
          readonly={true}
          initialValue={averageRating}
          allowFraction={true}
          SVGclassName="hidden md:inline-block h-[25px]"
        />

        {/* <span className="w-[0.09rem] h-full bg-gray-600" /> */}

        <div className="flex items-center text-[0.5rem] sm:text-xs md:text-sm lg:text-lg text-gray-400">
          <span>Average Rating:</span>
          <span className="text-[#ffbc0b] ml-2 mr-1">{averageRating}</span>
          <span>({anime.ratingsQuantity} reviews)</span>
        </div>
      </div>

      {/* details section */}

      <div className="grid grid-cols-2 w-full lg:w-[80%] mt-2 md:mt-5 font-[Lato] gap-y-1 text-[0.5rem] sm:text-xs md:text-sm lg:text-base gap-x-2">
        <p>
          <span className="text-gray-400">Type: </span>
          <span className="text-gray-100">{anime.type}</span>
        </p>

        <p>
          <span className="text-gray-400">Episodes: </span>
          <span className="text-gray-100">{anime.episodes} episodes</span>
        </p>

        <p>
          <span className="text-gray-400">Premiered: </span>
          <span className="text-gray-100">
            {capitalize(anime.premiered.season)} {anime.premiered.year}
          </span>
        </p>

        <p>
          <span className="text-gray-400">Country: </span>
          <span className="text-gray-100">{anime.country}</span>
        </p>

        <p>
          <span className="text-gray-400">Date aired: </span>
          <span className="text-gray-100">{aired}</span>
        </p>

        <p>
          <span className="text-gray-400">Studios: </span>
          <span className="text-gray-100">{anime.studios.join(", ")}</span>
        </p>

        <p>
          <span className="text-gray-400">Status: </span>
          <span className="text-gray-100">{capitalize(anime.status)}</span>
        </p>

        <p>
          <span className="text-gray-400">Broadcast: </span>
          <span className="text-gray-100">
            {anime.broadcast ? anime.broadcast : "N/A"}
          </span>
        </p>

        <p>
          <span className="text-gray-400">Genres: </span>
          <span className="text-gray-100">{anime.genres.join(", ")}</span>
        </p>

        <p>
          <span className="text-gray-400">Producers: </span>
          <span className="text-gray-100">{anime.producers.join(", ")}</span>
        </p>
      </div>
    </div>
  );
}

export default AnimeDetailsSection;
