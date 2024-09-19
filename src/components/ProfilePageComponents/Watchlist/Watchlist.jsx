import { motion } from "framer-motion";
import React, { useState } from "react";
import SearchBar from "../../Browse/SearchBar";
import WatchlistResults from "./WatchlistResults";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { addAnimeToWatchlist, queryClient } from "../../../util/http";
import { notificationActions } from "../../../store/NotificationSlice";

const OPTIONS = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Watching",
    value: "watching",
  },
  {
    title: "Plan To Watch",
    value: "plan to watch",
  },
  {
    title: "On Hold",
    value: "on hold",
  },
  {
    title: "Completed",
    value: "completed",
  },
  {
    title: "Dropped",
    value: "dropped",
  },
];

function Watchlist() {
  const [selectedOption, setSelectedOption] = useState(0);

  const dispatch = useDispatch();

  const { mutate: addAnime } = useMutation({
    mutationFn: addAnimeToWatchlist,
    onSuccess(data) {
      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: `${data.data.createdWatchlistEntry.title} added to watchlist successfully.`,
        })
      );

      // refetch the queries to make any changes in the current tab visible
      queryClient.refetchQueries({
        queryKey: ["watchlist", OPTIONS[selectedOption].value],
      });
    },
    onError(error) {
      dispatch(
        notificationActions.showErrorNotification({
          title: "Error",
          message: error?.info?.message || "Unable to add watchlist entry.",
        })
      );
    },
  });

  const handleAddAnimeToWatchlist = (anime) => {
    addAnime({ watchlistEntryData: { anime: anime._id } });
  };

  return (
    <motion.div
      className="w-full h-full mt-2 px-3 py-3"
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      transition={{ type: "tween" }}
    >
      <SearchBar
        searchBarColor="bg-[#101010]"
        placeholder="Search for an anime to add to your watchlist..."
        onSearchResultClicked={handleAddAnimeToWatchlist}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full p-3 mt-3">
        {OPTIONS.map(({ title }, index) => {
          const isSelected = index === selectedOption;

          let className = `text-white px-5 py-3 m-3 border border-[#ddd] outline-none rounded-md active:scale-95 hover:bg-[#ef9b00] ${
            isSelected ? "bg-[#ef9b00]" : ""
          }`;

          return (
            <button
              type="button"
              className={className}
              key={title}
              onClick={() => setSelectedOption(index)}
            >
              {title}
            </button>
          );
        })}
      </div>

      <WatchlistResults filterOption={OPTIONS[selectedOption].value} />
    </motion.div>
  );
}

export default Watchlist;
