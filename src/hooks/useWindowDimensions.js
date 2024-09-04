import React, { useEffect, useState } from "react";

function getScreenDimensions() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 640) {
    return "xs";
  } else if (screenWidth >= 640 && screenWidth < 768) {
    return "sm";
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    return "md";
  } else if (screenWidth >= 1024 && screenWidth < 1280) {
    return "lg";
  } else {
    return "xl";
  }
}

function useWindowDimensions() {
  const [windowSize, setWindowSize] = useState(getScreenDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getScreenDimensions());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  return { windowSize };
}

export default useWindowDimensions;
