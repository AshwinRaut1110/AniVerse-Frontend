import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAnimeDetailsById, getEpisodeData, queryClient } from "../util/http";
import EpisodeSelector from "../components/Anime/Episode/EpisodeSelector";
import EpisodePlayer from "../components/Anime/Episode/VideoPlayer/EpisodePlayer";
import AnimesSection from "../components/Anime/AnimesSection";
import useWindowDimensions from "../hooks/useWindowDimensions";
import AnimeCarousel from "../components/UI/AnimeCarousel";
import CommentsSection from "../components/Anime/Episode/Comment/CommentsSection";

function EpisodePage() {
  const { animeId, episodeIdentifier } = useParams();

  const { windowSize } = useWindowDimensions();

  const mainEpisodeDivClassname = useMemo(() => {
    let value = "flex flex-col w-full h-full space-y-5";

    if (windowSize === "lg" || windowSize === "xl")
      value = "flex w-full h-full space-x-5";

    return value;
  }, [windowSize]);

  // get the anime details
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["animes", animeId],
    queryFn: ({ signal }) => getAnimeDetailsById(animeId, signal, true),
    staleTime: 60000,
    gcTime: 60000,
  });

  // get the episode details
  const {
    data: episodeData,
    isPending: isEpisodePending,
    isError: isEpisodeError,
    error: episodeError,
  } = useQuery({
    queryKey: ["animes", animeId, "episodes", episodeIdentifier],
    queryFn: ({ signal }) => getEpisodeData(episodeIdentifier, animeId, signal),
  });

  if (isPending) return <div className="text-white text-2xl">loading...</div>;

  if (isError) return <div>{error.info.message}</div>;

  return (
    <div className="w-full h-full py-5 px-3 space-y-10">
      <div className={mainEpisodeDivClassname}>
        {["xs", "md", "sm"].includes(windowSize) && (
          <EpisodePlayer
            isPending={isEpisodePending}
            isError={isEpisodeError}
            error={episodeError}
            data={episodeData}
          />
        )}

        <EpisodeSelector
          totalEpisodes={data.data.anime.totalEpisodes || 100}
          // episodesPerPage={Math.ceil(data.data.anime.totalEpisodes * 0.2)}
          episodesPerPage={2}
        />

        {["xl", "lg"].includes(windowSize) && (
          <EpisodePlayer
            isPending={isEpisodePending}
            isError={isEpisodeError}
            error={episodeError}
            data={episodeData}
          />
        )}

        {/* top trending anime */}
        {windowSize !== "lg" && (
          <AnimesSection
            title="Top Rated"
            url={`${
              import.meta.env.VITE_API_URL
            }/api/v1/animes?sort=-averageRating&limit=5`}
          />
        )}
      </div>

      {/* top trending anime */}
      {windowSize === "lg" && (
        <AnimesSection
          title="Top Rated"
          url={`${
            import.meta.env.VITE_API_URL
          }/api/v1/animes?sort=-averageRating&limit=5`}
        />
      )}

      {/* Recommended Animes and More Season Section  */}
      <div className="flex flex-col xl:flex-row w-full h-full space-y-5 xl:space-y-0 xl:space-x-5">
        {data.data.anime.relatedAnimes.length && (
          <div className="w-[100%] xl:w-[77%]">
            <h3 className="text-white font-[Lato] text-2xl font-bold mb-4">
              More Seasons
            </h3>
            <AnimeCarousel
              animes={data.data.anime.relatedAnimes}
              breakpoints={{
                0: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
              }}
            />
          </div>
        )}

        {/* recommended anime */}
        <AnimesSection
          title="Recommended"
          url={`${import.meta.env.VITE_API_URL}/api/v1/animes?genres=${
            data.data.anime.genres[0]
          }&limit=5`}
          fullWidth={!data.data.anime.relatedAnimes.length}
        />
      </div>

      {/* comments section */}
      <h3 className="text-white font-[Lato] text-2xl font-bold">Comments</h3>
      {episodeData && !isPending && (
        <CommentsSection activeEpisode={episodeData.data.episode} />
      )}
    </div>
  );
}

export default EpisodePage;
