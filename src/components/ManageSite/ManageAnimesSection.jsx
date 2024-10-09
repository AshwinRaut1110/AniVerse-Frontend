import React, { useState } from "react";
import AnimeCreator from "../Anime/AnimeCreator";
import SearchBar from "../Browse/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { getAnimeDetailsById } from "../../util/http";

function ManageAnimesSection() {
  const [animeId, setAnimeId] = useState("");

  const handleSearchResultClicked = (anime) => {
    setAnimeId(anime._id);
  };

  const { data, isError, error, isPending } = useQuery({
    queryKey: ["animes", animeId],
    queryFn: ({ signal }) => getAnimeDetailsById(animeId, signal),
    enabled: !!animeId,
    staleTime: Infinity,
  });

  let existingAnimeData = null;

  if (!isPending && !isError && data) existingAnimeData = data.data.anime;

  return (
    <div className="px-3">
      <h1 className="text-center text-3xl sm:text-5xl font-bold font-[Lato] py-10">
        <span className="text-[#007bff]">The Anime</span>{" "}
        <span className="text-orange-500">Studio</span>
      </h1>
      <SearchBar
        searchBarColor="bg-[#101010]"
        placeholder="Search for an anime to edit..."
        onSearchResultClicked={handleSearchResultClicked}
      />
      <AnimeCreator
        existingAnimeData={existingAnimeData}
        animeId={animeId}
        mode={existingAnimeData ? "update" : "add"}
      />
      ;
    </div>
  );
}

export default ManageAnimesSection;
