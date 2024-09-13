import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAnimes } from "../../util/http";
import SearchBarResultCard from "./SearchBarResultCard";

function AnimeSearchResults({ title, setIsPending, onSearchResultClicked }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["animes", "title", title],
    queryFn: ({ signal }) =>
      getAnimes(
        {
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
        signal
      ),
  });

  useEffect(() => {
    setIsPending(isPending);

    return () => setIsPending(false);
  }, [isPending]);

  if (isError) console.log(error);

  return (
    <motion.div
      layout
      transition={{
        type: "tween",
      }}
      className="absolute top-11 w-full bg-[#191919] z-30"
    >
      {data &&
        data.data.animes.map((anime) => (
          <SearchBarResultCard
            anime={anime}
            key={anime._id}
            onSearchResultClicked={onSearchResultClicked}
          />
        ))}
    </motion.div>
  );
}

export default AnimeSearchResults;
