import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

function Carousel({ cards }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [slideIndex, setSlideIndex] = useState(1);

  const [prevArrowPressed, setPrevArrowPressed] = useState(false);

  const [nextArrowPressed, setNextArrowPressed] = useState(false);

  useEffect(() => {
    const handleScreenWidthChanged = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleScreenWidthChanged);

    return () => {
      window.removeEventListener("resize", handleScreenWidthChanged);
    };
  }, []);

  const handleGoToPreviousSlide = () => {
    setSlideIndex((prevValue) => prevValue - 1);
    setPrevArrowPressed(true);
    setNextArrowPressed(false);
  };

  const handleGoToNextSlide = () => {
    setSlideIndex((prevValue) => prevValue + 1);
    setNextArrowPressed(true);
    setPrevArrowPressed(false);
  };

  const slides = [];

  let numOfCols = 2;

  if (screenWidth >= 640 && screenWidth < 768) {
    numOfCols = 3;
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    numOfCols = 4;
  } else if (screenWidth >= 1024) {
    numOfCols = 5;
  }

  const numOfSlides = Math.ceil(cards.length / numOfCols);

  for (let i = 0; i < numOfSlides; i++) {
    if (i === numOfSlides) {
      slides.push(cards.slice(i * numOfCols));
    } else {
      const cardIndex = i * numOfCols;
      slides.push(cards.slice(cardIndex, cardIndex + numOfCols));
    }
  }

  let slide;

  if (slideIndex === numOfSlides) {
    // if this is the last slide
    slide = cards.slice((slideIndex - 1) * numOfCols);
  } else {
    const cardIndex = (slideIndex - 1) * numOfCols;
    slide = cards.slice(cardIndex, cardIndex + numOfCols);
  }

  console.log(slides);

  slide = cards;

  console.log(numOfCols);

  return (
    <div className={`relative flex w-[95%] mx-auto`}>
      <div className="w-full flex space-x-4 overflow-x-scroll scrollbar-hide">
        {slides.map((slide, i) => {
          const index = i + 1;

          let className = `flex space-x-4 min-w-full `;

          if (index < slideIndex) {
            className += "hidden ";
          }

          if (index === slideIndex) {
            if (prevArrowPressed) {
              className += "move-in-from-left-animation ";
            }

            if (nextArrowPressed) {
              className += "move-in-from-right-animation ";
            }
          }

          return (
            <div className={className} key={i}>
              {slide}
            </div>
          );
        })}
      </div>

      {slideIndex !== 1 && (
        <ChevronLeftIcon
          className="text-white h-10 absolute left-0 top-0 mt-auto bottom-0 mb-auto cursor-pointer hover:text-orange-500"
          onClick={handleGoToPreviousSlide}
        />
      )}

      {slideIndex !== numOfSlides && (
        <ChevronRightIcon
          className="text-white h-10 absolute right-0 top-0 mt-auto bottom-0 mb-auto cursor-pointer hover:text-orange-500"
          onClick={handleGoToNextSlide}
        />
      )}
    </div>
  );
}

export default Carousel;
