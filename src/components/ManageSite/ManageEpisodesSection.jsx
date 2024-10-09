import React, { useEffect, useMemo, useState } from "react";
import EpisodeCreator from "../Anime/Episode/EpisodeCreator";
import { useQuery } from "@tanstack/react-query";
import { getEpisodeData, queryClient } from "../../util/http";
import ErrorComponent from "../UI/ErrorComponent";
import NyanLoader from "../UI/NyanLoader";
import SearchBar from "../Browse/SearchBar";

const initialState = {
  title: {
    english: "",
    japanese: "",
  },
  episodeNumber: "",
  anime: "",
  description: "",
  releasedAt: "",
  createdAt: "",
  thumbnail: "",
  streamLink: "",
  versions: {
    360: false,
    480: false,
    720: false,
  },
};

function ManageEpisodesSection() {
  const [episodeData, setEpisodeData] = useState(initialState);
  const [episodeIdentifier, setEpisodeIdentifier] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["animes", episodeData.anime, "episodes", episodeIdentifier],
    queryFn: ({ signal }) =>
      getEpisodeData(episodeIdentifier, episodeData.anime, signal),
    enabled: !!episodeData.anime && !!episodeIdentifier,
    staleTime: Infinity,
  });

  const handleHideError = () => {
    setEpisodeData(initialState);
  };

  const handleAnimeSearchResultClicked = (anime) => {
    setEpisodeData((prevValue) => ({
      ...prevValue,
      anime: anime._id,
    }));
  };

  const handleEpisodeIdentifierChanged = (e) => {
    setEpisodeIdentifier(e.target.value);
  };

  const mode = useMemo(() => {
    if (
      episodeIdentifier.trim() &&
      episodeData.anime &&
      !isError &&
      !isLoading &&
      data
    )
      return "update";
    return "add";
  }, [episodeIdentifier, episodeData.anime, isError, isLoading, data]);

  useEffect(() => {
    if (data) setEpisodeData(data.data.episode);
  }, [data]);

  const handleEpisodeDataReset = () => {
    setEpisodeData(initialState);
    setEpisodeIdentifier("");
  };

  return (
    <div className="px-3 pb-10">
      <h1 className="text-center text-3xl sm:text-5xl font-bold font-[Lato] py-10">
        <span className="text-[#007bff]">The Episode</span>{" "}
        <span className="text-orange-500">Studio</span>
      </h1>
      {isError && (
        <ErrorComponent
          errors={error.info.message}
          onHideError={handleHideError}
        />
      )}
      <div className="flex flex-col md:flex-row items-center w-full">
        <SearchBar
          searchBarColor="bg-[#101010]"
          placeholder="Search for an anime to edit its episodes..."
          onSearchResultClicked={handleAnimeSearchResultClicked}
          fullWidth={true}
        />
        <input
          type="text"
          placeholder="Episode Number"
          name="episodeIdentifier"
          id="episodeIdentifier"
          autoComplete="off"
          className="h-11 w-full mt-3 md:ml-3 md:mt-1 md:max-w-fit text-sm font-semibold p-2 rounded-md outline-none bg-[#212121] text-gray-500 placeholder:text-gray-500 border border-[#171717] shadow-md"
          value={episodeIdentifier}
          onChange={handleEpisodeIdentifierChanged}
        />
      </div>
      {isLoading && <NyanLoader className="h-28 m-auto mt-20" />}
      <EpisodeCreator
        episodeData={episodeData}
        setEpisodeData={setEpisodeData}
        mode={mode}
        onEpisodeDataReset={handleEpisodeDataReset}
      />
    </div>
  );
}

export default ManageEpisodesSection;
