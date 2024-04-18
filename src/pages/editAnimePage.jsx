import { useQuery } from "@tanstack/react-query";
import AnimeCreator from "../components/Anime/animeCreator";
import { useParams } from "react-router-dom";
import { getAnimeDetailsForStudio } from "../util/http";

function editAnimePage() {
  // fetch the anime details

  const { animeId } = useParams();

  const { data, isError, error, isPending } = useQuery({
    queryKey: ["anime", animeId],
    queryFn: ({ signal }) => getAnimeDetailsForStudio(animeId, signal),
  });

  console.log(data);

  return (
    <div className="p-5 pt-7">
      <h1 className="text-center text-3xl sm:text-5xl font-bold font-[Lato]">
        <span className="text-[#007bff]">The Anime</span>{" "}
        <span className="text-orange-500">Studio</span>
      </h1>
      {data && (
        <AnimeCreator
          existingAnimeData={data.data.anime}
          isPending={isPending}
        />
      )}
    </div>
  );
}

export default editAnimePage;
