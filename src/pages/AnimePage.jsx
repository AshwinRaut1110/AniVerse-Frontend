import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAnimeDetailsById } from "../util/http";
import { applyWordLimit, capitalize } from "../util/misc";
import AnimeDetailsSection from "../components/Anime/AnimeDetailsSection";
import AnimeGrid from "../components/UI/AnimeGrid";
import Reviews from "../components/Reviews/Reviews";

function AnimePage() {
  const { animeId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["animes", animeId],
    queryFn: ({ singal }) => getAnimeDetailsById(animeId, singal, true),
    staleTime: 60000,
    gcTime: 60000,
  });

  if (isLoading) return <></>;

  const { anime } = data.data;

  const averageRating = anime.averageRating.toFixed(1);

  return (
    <div className="h-full w-full pb-10">
      {/* banner section */}

      <div className="relative w-full h-full aspect-[1.77/1]">
        {/* gradient effect */}
        <div className="banner-div"></div>

        {/* banner image */}
        <img
          src={data.data.anime.banner}
          alt={data.data.anime.names.english}
          className="absolute top-0 left-0 z-0"
        />

        {/* anime details div */}
        <div className="absolute top-0 bottom-0 mt-auto mb-auto max-h-[80%] md:max-h-[50%] lg:max-h-[40%] max-w-[80%] md:max-w-[60%] lg:max-w-[50%] left-10 md:left-20 z-10">
          <h2 className="text-white text-lg md:text-5xl lg:text-7xl font-[Lato] font-bold">
            {anime.names.english}
          </h2>

          <p className="text-gray-300 md:text-gray-400 text-xs md:text-base font-[Lato] space-x-10 mt-2">
            <span>
              Premiered in {capitalize(anime.premiered.season)}{" "}
              {anime.premiered.year}
            </span>
          </p>

          <p className="text-white text-[0.7rem] md:text-base w-full font-[Lato] mt-2">
            {applyWordLimit(anime.description, 50)}
          </p>

          {/* watch now button */}
          <button className="bg-[#007bff] hover:bg-[#1385ff] text-white px-5 md:px-9 lg:px-11 py-3 md:py-5 text-xs md:text-xl lg:text-2xl font-bold mt-2 md:mt-10 rounded-lg active:scale-95 transition-all ease-in-out outline-none">
            START BINGING
          </button>
        </div>
      </div>

      {/* anime info section */}

      <div className="flex h-full w-full px-3 sm:px7 md:px-14 py-10">
        <div>
          <img
            src={anime.thumbnail}
            alt={anime.names.english}
            className="rounded-xl shadow-md shadow-gray-900 aspect-[0.7/1] w-[150px] sm:w-[250px] md:w-[350px] lg:w-[460px]"
          />
        </div>

        <AnimeDetailsSection anime={anime} averageRating={averageRating} />
      </div>

      {/* more seasons */}
      <div className="flex flex-col space-y-5 w-full px-3 sm:px7 md:px-14 py-7">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-[Lato] font-bold text-[#007bff]">
          More Seasons
        </h3>

        <AnimeGrid animes={anime.relatedAnimes} mode="seasons" />
      </div>

      {/* reviews section */}
      <Reviews averageRating={anime.averageRating} ratingsQuantity={anime.ratingsQuantity} />
    </div>
  );
}

export default AnimePage;
