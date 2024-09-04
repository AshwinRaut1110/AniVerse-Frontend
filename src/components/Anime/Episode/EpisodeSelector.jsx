import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DropdownTwo from "../../UI/Dropdown/DropdownTwo";
import EpisodesList from "./EpisodesList";
import { getPageOptions } from "../../../util/misc";
import TopAnimesSection from "../AnimesSection";

// const options = [
//   {
//     title: "001 - 010",
//     page: 1,
//   },
//   {
//     title: "011 - 020",
//     page: 2,
//   },
//   {
//     title: "021 - 030",
//     page: 3,
//   },
// ];

function EpisodeSelector({ totalEpisodes, episodesPerPage }) {
  const { animeId, episodeIdentifier } = useParams();

  const intialPage = useMemo(
    () => Math.ceil(+episodeIdentifier / episodesPerPage),
    [episodeIdentifier]
  );

  // setting up the page dropdown options for available pages of episodes
  const pageOptions = useMemo(
    () => getPageOptions(totalEpisodes, episodesPerPage),
    []
  );

  // also just move the ep1 page if the thing is out of bounds
  // intial active page will be the page where the current episode is, also make sure that if the user add a episode number that is out of bounds just default to intial page as 1
  const [activePage, setActivePage] = useState(
    +episodeIdentifier > totalEpisodes ? 1 : intialPage
  );

  const navigate = useNavigate();

  const handleActivePageChanged = (selectedPage) => {
    setActivePage(selectedPage.page);
  };

  const handleEpisodeNumberEntered = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    navigate(`/animes/${animeId}/${formData.get("episodeNumber")}`);
  };

  useEffect(() => setActivePage(intialPage), [intialPage]);

  return (
    <div className="flex flex-col space-y-4 bg-[#010101] w-[100%] lg:w-[30%] xl:w-[20%] py-3 px-2 rounded-md">
      {/* top bar */}
      <div className="flex items-center space-x-3">
        <DropdownTwo
          options={pageOptions}
          onOptionSelected={handleActivePageChanged}
          initialSelectedIndex={
            +episodeIdentifier > totalEpisodes ? 0 : intialPage - 1
          }
        />
        <form className="flex" onSubmit={handleEpisodeNumberEntered}>
          <input
            type="text"
            placeholder="enter episode number"
            name="episodeNumber"
            id="episodeNumber"
            autoComplete="off"
            className="text-xs px-2 py-[0.38rem] w-28 max-w-28 rounded-md outline-none bg-[#212121] text-gray-500 placeholder:text-gray-500 border border-[#171717] shadow-md"
          />
        </form>
      </div>

      {/* episodes list */}
      <EpisodesList pageNumber={activePage} episodesPerPage={episodesPerPage} />
    </div>
  );
}

export default EpisodeSelector;
