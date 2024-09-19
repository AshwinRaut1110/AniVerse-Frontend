import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAnimes } from "../../util/http";
import SearchBarResultCard from "./SearchBarResultCard";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function AnimeSearchResults({ title, setIsPending, onSearchResultClicked }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["animes", "title", title],
    queryFn: ({ signal }) =>
      getAnimes({
        searchFilters: {
          title,
          page: 1,
          limit: 4,
          project: {
            names: 1,
            thumbnail: 1,
            type: 1,
            premiered: 1,
            duration: 1,
          },
        },
        pageParam: 1,
        limit: 4,
        signal,
      }),
  });

  const navigate = useNavigate();

  useEffect(() => {
    setIsPending(isPending);

    return () => setIsPending(false);
  }, [isPending]);

  // if view more results is clicked send the user to browse page with intial filter value of {title}
  const handleViewMoreResultsClicked = () => {
    navigate("/browse", { state: { title } });
  };

  if (isError) console.log(error); // handle this error

  return (
    <motion.div
      layout
      transition={{
        type: "tween",
      }}
      className="absolute top-11 w-full bg-[#191919] z-30"
    >
      {data && (
        <>
          {data.data.animes.map((anime) => (
            <SearchBarResultCard
              anime={anime}
              key={anime._id}
              onSearchResultClicked={onSearchResultClicked}
            />
          ))}

          <div
            className="flex items-center justify-center w-full h-12 lg:h-14 text-white lg:text-lg font-[Lato] font-semibold bg-primary-blue cursor-pointer rounded-bl-md rounded-br-md space-x-2"
            onClick={handleViewMoreResultsClicked}
          >
            <span>View All Results</span>
            <ChevronRightIcon className="h-5 mt-[2px]" strokeWidth={3} />
          </div>
        </>
      )}
    </motion.div>
  );
}

export default AnimeSearchResults;
