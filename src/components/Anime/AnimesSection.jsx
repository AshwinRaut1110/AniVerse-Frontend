import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAnimes } from "../../util/http";
import AnimeCardSmall from "./AnimeCardSmall";

function AnimesSection({ title, url, fullWidth }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["animes"],
    queryFn: ({ signal }) => getAnimes(url, signal),
  });

  return (
    <div
      className={`flex w-[100%] ${
        !fullWidth ? "xl:w-[23%]" : ""
      } lg:mt-5 xl:mt-0 flex-col space-y-2`}
    >
      <h3 className="text-white font-[Lato] text-2xl font-bold mb-4">
        {title}
      </h3>
      {data &&
        data.data.animes.map((anime) => (
          <AnimeCardSmall key={anime._id} anime={anime} />
        ))}
    </div>
  );
}

export default AnimesSection;
