import AnimeCreator from "../components/Anime/AnimeCreator";

function addNewAnimePage() {
  return (
    <div className="p-5 pt-7">
      <h1 className="text-center text-3xl sm:text-5xl font-bold font-[Lato]">
        <span className="text-[#007bff]">The Anime</span>{" "}
        <span className="text-orange-500">Studio</span>
      </h1>
      <AnimeCreator />
    </div>
  );
}

export default addNewAnimePage;
