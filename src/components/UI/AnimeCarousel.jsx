import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import AnimeCard from "../Anime/AnimeCard";

function AnimeCarousel({ animes, breakpoints, keepMinHeight }) {
  return (
    <Swiper
      breakpoints={breakpoints}
      loop={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className={`w-full mx-auto ${keepMinHeight ? "md:min-h-[450px]" : ""}`}
    >
      {animes.map(({ anime, relation }) => (
        <SwiperSlide key={anime._id}>
          <AnimeCard anime={anime} relation={relation} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default AnimeCarousel;
