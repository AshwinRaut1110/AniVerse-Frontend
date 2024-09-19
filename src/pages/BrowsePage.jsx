import React, { useState } from "react";
import BrowsePageResults from "../components/Browse/BrowsePageResults";
import BrowsePageFilters from "../components/Browse/BrowsePageFilters";
import { useLocation } from "react-router-dom";

function BrowsePage() {
  // get the initial filter passed from other pages
  const { state } = useLocation();

  const [searchFilters, setSearchFilters] = useState(state || {});

  const handleFilterClicked = (filters) => {
    setSearchFilters(state ? { ...state, ...filters } : filters);
  };

  return (
    <div className="py-12 px-5 sm:px-8 md:px-10 lg:px-14">
      {/* search filters */}
      <BrowsePageFilters onFilterClicked={handleFilterClicked} />
      {searchFilters && <BrowsePageResults searchFilters={searchFilters} />}
    </div>
  );
}

export default BrowsePage;
