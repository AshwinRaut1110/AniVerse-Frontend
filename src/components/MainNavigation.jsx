import { Link, useNavigate } from "react-router-dom";
import OptionsDropdown from "./UI/Menu/Menu";
import SearchBar from "./Browse/SearchBar";
import useWindowDimensions from "../hooks/useWindowDimensions";

function MainNavigation() {
  const { windowSize } = useWindowDimensions();

  const navigate = useNavigate();

  const handleSearchResultClicked = (anime) => {
    navigate(`/animes/${anime._id}`);
  };

  return (
    <header className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center sticky top-0 z-[25] bg-secondary-color px-5 py-[0.8rem]">
      <div className="flex w-full items-center space-x-5">
        <Link to="/">
          <h1 className="text-3xl md:text-5xl font-bold select-none">
            <span className="text-[#007bff]">AniVerse</span>
          </h1>
        </Link>

        {["lg", "xl"].includes(windowSize) && (
          <SearchBar onSearchResultClicked={handleSearchResultClicked} />
        )}

        <div className="relative flex flex-grow justify-end">
          <OptionsDropdown />
        </div>
      </div>
      {["sm", "md", "xs"].includes(windowSize) && (
        <SearchBar onSearchResultClicked={handleSearchResultClicked} />
      )}
    </header>
  );
}

export default MainNavigation;
