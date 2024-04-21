import React from "react";

function AnimeCard({ anime, relation }) {
  return (
    <div className="aspect-[0.71/1]">
      <img src={anime.thumbnail} alt={anime.names.english} />
    </div>
  );
}

export default AnimeCard;
