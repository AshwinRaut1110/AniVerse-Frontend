import React, { useState } from "react";
import {
  countryOptions,
  ratingOptions,
  seasonOptions,
  statusOptions,
  typeOptions,
} from "../../util/filterOptions";
import DropdownThree from "../UI/Dropdown/DropdownThree";
import DatePicker from "../UI/Inputs/DatePicker";
import { GENRES } from "../../util/constants";

function BrowsePageFilters({ onFilterClicked }) {
  // states
  const [genres, setGenres] = useState([]);

  const [aired, setAired] = useState({
    start: "",
    end: "",
  });

  const [premiered, setPremiered] = useState({
    season: "",
    year: "",
  });

  const [filters, setFilters] = useState({
    type: "",
    status: "",
    country: "",
    averageRating: "",
  });

  const handleNestedValueChnaged = (setterFunction, key, value) => {
    setterFunction((prevValue) => ({ ...prevValue, [key]: value }));
  };

  const handleGenreClicked = (clickedGenre) => {
    const genreIndex = genres.findIndex((genre) => genre === clickedGenre);

    setGenres((prevValue) => {
      const updatedGenres = [...prevValue];

      if (genreIndex === -1) {
        updatedGenres.push(clickedGenre);
      } else {
        updatedGenres.splice(genreIndex, 1);
      }

      return updatedGenres;
    });
  };

  const handleProcessFilters = () => {
    const updatedFilters = { ...filters };
    const updatedAired = { ...aired };
    const updatedPremiered = { ...premiered };
    let finalFilters = {};

    // make sure that empty fields are deleted from the filter objects
    for (const key in updatedFilters) {
      if (!updatedFilters[key]) delete updatedFilters[key];
    }

    for (const key in updatedAired) {
      if (!updatedAired[key]) delete updatedAired[key];
    }

    for (const key in updatedPremiered) {
      if (!updatedPremiered[key]) delete updatedPremiered[key];
    }

    const searchFilters = {};

    // only add the filter object if it has atleast one entry
    if (Object.keys(updatedFilters).length)
      finalFilters = { ...finalFilters, ...updatedFilters };
    if (Object.keys(updatedAired).length)
      finalFilters = { ...finalFilters, aired: updatedAired };
    if (Object.keys(updatedPremiered).length) {
      if (updatedPremiered.year) updatedPremiered.year = +updatedPremiered.year;
      finalFilters = { ...finalFilters, premiered: updatedPremiered };
    }
    if (genres.length) finalFilters["genres"] = genres;

    if (Object.keys(finalFilters).length) {
      searchFilters["filter"] = finalFilters;
      onFilterClicked(searchFilters);
    } else onFilterClicked({});
  };

  return (
    <div className="p-5 space-y-5 rounded-md shadow-lg bg-[#171717]">
      <div className="w-full space-y-5">
        <h3 className="text-2xl font-bold font-[Lato] text-[#DDDDDD] my-3">
          Filters
        </h3>

        {/* filter row 1 */}
        <div className="grid sm:grid-rows-3 sm:grid-cols-2 md:grid-rows-2 md:grid-cols-3 lg:grid-rows-2 lg:grid-cols-4 xl:grid-rows-1 xl:grid-cols-6 gap-3">
          <DropdownThree
            options={typeOptions}
            initialSelectedIndex={0}
            dropdownName="Type"
            onOptionSelected={(option) =>
              handleNestedValueChnaged(
                setFilters,
                "type",
                option.value === "all" ? "" : option.value
              )
            }
          />

          <DropdownThree
            options={statusOptions}
            initialSelectedIndex={0}
            dropdownName="Status"
            onOptionSelected={(option) =>
              handleNestedValueChnaged(
                setFilters,
                "status",
                option.value === "all" ? "" : option.value
              )
            }
          />

          <DropdownThree
            options={seasonOptions}
            initialSelectedIndex={0}
            dropdownName="Season"
            onOptionSelected={(option) =>
              handleNestedValueChnaged(
                setPremiered,
                "season",
                option.value === "all" ? "" : option.value
              )
            }
          />

          <input
            type="text"
            placeholder="Year"
            name="yearinput"
            id="yearinput"
            autoComplete="off"
            className="text-sm font-semibold p-2 w-full rounded-md outline-none bg-[#212121] text-gray-500 placeholder:text-gray-500 border border-[#171717] shadow-md"
            value={premiered.year}
            onChange={(e) =>
              handleNestedValueChnaged(setPremiered, "year", e.target.value)
            }
          />

          <DropdownThree
            options={countryOptions}
            initialSelectedIndex={0}
            dropdownName="Country"
            onOptionSelected={(option) =>
              handleNestedValueChnaged(
                setFilters,
                "country",
                option.value === "all" ? "" : option.value
              )
            }
          />

          <DropdownThree
            options={ratingOptions}
            initialSelectedIndex={0}
            dropdownName="Rating"
            onOptionSelected={(option) =>
              handleNestedValueChnaged(
                setFilters,
                "averageRating",
                option.value === "all" ? "" : option.value
              )
            }
          />
        </div>

        {/* filter row 2 */}
        <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5 md:items-center w-full">
          <DatePicker
            placeholder="Start Date"
            onDateChanged={(value) =>
              handleNestedValueChnaged(setAired, "start", value)
            }
          />
          <DatePicker
            placeholder="End Date"
            onDateChanged={(value) =>
              handleNestedValueChnaged(setAired, "end", value)
            }
          />
        </div>
      </div>

      {/* genres filter */}

      {/* genres div */}
      <div className="w-full">
        <h3 className="text-2xl font-bold font-[Lato] text-[#DDDDDD] my-3">
          Genres
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex flex-wrap w-full">
          {GENRES.map((genre) => {
            const isSelected = genres.includes(genre);

            let className = `text-white px-5 py-3 m-3 border border-[#ddd] outline-none rounded-md active:scale-95 hover:bg-[#ef9b00] ${
              isSelected ? "bg-[#ef9b00]" : ""
            }`;

            return (
              <button
                type="button"
                value={genre}
                className={className}
                key={genre}
                onClick={(e) => handleGenreClicked(e.target.value)}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* controls div */}
      <div className="flex justify-end px-4 w-full">
        <button
          className="bg-[#007bff] hover:bg-[#1385ff] text-white px-10 py-3 text-lg font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none"
          onClick={handleProcessFilters}
        >
          Filter
        </button>
      </div>
    </div>
  );
}

export default BrowsePageFilters;
