import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import AnimeCard from "../Anime/AnimeCard";

function AnimeCarousel({ animes }) {
  return (
    <Swiper
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
      }}
      loop={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="w-full mx-auto min-h-[450px]"
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
