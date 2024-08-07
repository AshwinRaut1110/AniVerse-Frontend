import { Link } from "react-router-dom";
import OptionsDropdown from "./UI/Menu/Menu";

function MainNavigation() {
  return (
    <header className="flex justify-between items-center sticky top-0 z-[25] bg-secondary-color px-5 py-[0.8rem]">
      <Link to="/">
        <h1
          // className="text-5xl font-bold text-gradient-animation select-none"
          className="text-3xl md:text-5xl font-bold select-none"
        >
          <span className="text-[#007bff]">AniVerse</span>
          {/* <span className="text-orange-500">Verse</span> */}
        </h1>
      </Link>

      <div className="relative flex flex-grow justify-end">
        <OptionsDropdown />
      </div>
    </header>
  );
}

export default MainNavigation;
