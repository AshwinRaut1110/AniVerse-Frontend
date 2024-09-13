import React, { useEffect, useRef, useState } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AnimeSearchResults from "./AnimeSearchResults";
import { AnimatePresence } from "framer-motion";
import NyanLoader from "../UI/NyanLoader";

function SearchBar() {
  const { windowSize } = useWindowDimensions();

  const ref = useRef(null);

  const [title, setTitle] = useState("");

  const [showResults, setShowResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const areResultsVisible = !isTyping && showResults && title.length >= 3;

  // ensures that we only make the search request when the user has stopped typing for atleast a 800ms
  useEffect(() => {
    if (!isTyping) setIsTyping(true);

    const delayDebounceFn = setTimeout(() => {
      setIsTyping(false);
      setShowResults(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [title]);

  const width = ["lg", "xl"].includes(windowSize)
    ? "lg:min-w-[30rem] xl:min-w-[40rem]"
    : "w-full";

  // close the results dropdown on clicks outside the search bar div
  useEffect(() => {
    const handler = function (e) {
      if (ref.current && !ref.current.contains(e.target)) setShowResults(false);
    };

    if (areResultsVisible) window.addEventListener("click", handler);

    return () => window.removeEventListener("click", handler);
  }, [areResultsVisible]);

  const handleSearchResultClicked = () => {
    setShowResults(false);
    setTitle("");
  };

  return (
    <div className={`relative top-1 ${width} h-11`} ref={ref}>
      <div className="flex items-center px-3 w-full h-full bg-[#171717] shadow-md rounded-md">
        <MagnifyingGlassIcon className="text-gray-500 h-6" strokeWidth={3} />
        <input
          type="text"
          className="w-full h-full bg-[#171717] outline-none placeholder:text-gray-500 text-gray-400 px-3 font-[Lato]"
          placeholder="Search anime..."
          onFocus={() => setShowResults(true)}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {isPending && <NyanLoader className="h-7" />}
      </div>

      <AnimatePresence>
        {areResultsVisible && (
          <AnimeSearchResults title={title} setIsPending={setIsPending} onSearchResultClicked={handleSearchResultClicked} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
