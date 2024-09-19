import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAnimes } from "../../util/http";
import NyanLoader from "../UI/NyanLoader";
import AnimeGrid from "../UI/AnimeGrid";

function BrowsePageResults({ searchFilters }) {
  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["animes", "search", searchFilters],
    queryFn: ({ signal, pageParam }) =>
      getAnimes({ searchFilters, signal, pageParam, limit: 10 }), // ADD A PROJECT STAGE HERE
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.results === 0 ? null : pages.length + 1;
    },
    staleTime: 60000 * 5,
  });

  if (isError) console.log(error); // handle this error

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold font-[Lato] text-[#DDDDDD] my-5">
        Search Results
      </h3>

      {isPending && (
        <div className="flex items-center justify-center w-full py-10">
          <NyanLoader className="h-28 md:h-32" />
        </div>
      )}

      {!isPending && !isError && data && <AnimeGrid pages={data.pages} />}

      {hasNextPage && !isFetching && !isFetchingNextPage && (
        <div className="flex justify-center px-4 py-10 w-full">
          <button
            className="bg-[#007bff] hover:bg-[#1385ff] text-white px-10 py-3 text-lg font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none"
            onClick={fetchNextPage}
          >
            Load More Results
          </button>
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center px-4 py-10 w-full">
          <NyanLoader className="h-16" />
        </div>
      )}

      {!isError && !isFetching && !isFetchingNextPage && !hasNextPage && (
        <div className="flex justify-center px-4 py-10 w-full">
          <p className="text-gray-300 text-sm md:text-base text-center">
            It looks like you have gone through all the search results 🙃
          </p>
        </div>
      )}
    </div>
  );
}

export default BrowsePageResults;
