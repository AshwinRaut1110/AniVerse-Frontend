import AnimeCardSmall from "../Anime/AnimeCardSmall";

function AnimeGrid({ animes, mode }) {
  if (mode === "seasons") {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full mx-auto">
        {animes.map(({ anime, relation }) => (
          <AnimeCardSmall anime={anime} relation={relation} key={anime._id} />
        ))}
      </div>
    );
  } else if (mode === "related") {
  } else {
  }
}

export default AnimeGrid;
