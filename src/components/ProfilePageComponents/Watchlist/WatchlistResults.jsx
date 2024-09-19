import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { getMyWatchlist } from "../../../util/http";
import WatchlistCard from "../../Anime/AnimeCards/WatchlistCard";
import NyanLoader from "../../UI/NyanLoader";

function WatchlistResults({ filterOption }) {
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
    queryKey: ["watchlist", filterOption],
    queryFn: ({ pageParam, signal }) =>
      getMyWatchlist({ signal, pageParam, filterOption }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.results === 0 ? null : pages.length + 1;
    },
  });

  if (isPending) return "loading...";

  if (isError) return error.info.message || "Something went wrong.";

  return (
    <div className="w-full">
      {isPending && (
        <div className="flex items-center justify-center w-full py-10">
          <NyanLoader className="h-28 md:h-32" />
        </div>
      )}

      <div className="w-full p-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {data.pages.map((page, index) => (
          <Fragment key={index}>
            {page.data.watchlistItems.map((anime) => (
              <WatchlistCard
                anime={anime}
                key={anime._id}
                filterOption={filterOption}
              />
            ))}
          </Fragment>
        ))}
      </div>

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
            It looks like you have gone through your watchlist, why not explore
            something new 🙃
          </p>
        </div>
      )}
    </div>
  );
}

export default WatchlistResults;
