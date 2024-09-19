import React from "react";
import { motion } from "framer-motion";
import DropdownThree from "../../UI/Dropdown/DropdownThree";
import {
  deleteWatchlistEntry,
  queryClient,
  updateWatchlistEntry,
} from "../../../util/http";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store/NotificationSlice";
import NyanLoader from "../../UI/NyanLoader";
import { TrashIcon } from "@heroicons/react/24/outline";

export const statusOptions = [
  {
    title: "Watching",
    value: "watching",
  },
  {
    title: "Completed",
    value: "completed",
  },
  {
    title: "On Hold",
    value: "on hold",
  },
  {
    title: "Dropped",
    value: "dropped",
  },
  {
    title: "Plan to Watch",
    value: "plan to watch",
  },
];

function WatchlistCard({ anime, filterOption }) {
  const dispatch = useDispatch();

  const { mutate: update, isPending: updateIsPending } = useMutation({
    mutationFn: updateWatchlistEntry,
    onSuccess() {
      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: "Anime status updated successfully.",
        })
      );

      // refetch the queries to make any changes in the current tab visible
      if (filterOption.value !== "all") {
        queryClient.refetchQueries({ queryKey: ["watchlist", filterOption] });
      }
    },
    onError(error) {
      dispatch(
        notificationActions.showErrorNotification({
          title: "Error",
          message: error?.info?.message || "Unable to update anime status.",
        })
      );
    },
  });

  const { mutate: deleteEntry, isPending: deleteIsPending } = useMutation({
    mutationFn: deleteWatchlistEntry,
    onSuccess() {
      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: "Watchlist entry deleted successfully.",
        })
      );

      // refetch the queries to make any changes in the current tab visible
      queryClient.refetchQueries({ queryKey: ["watchlist", filterOption] });
    },
    onError(error) {
      dispatch(
        notificationActions.showErrorNotification({
          title: "Error",
          message: error?.info?.message || "Unable to delete watchlist entry.",
        })
      );
    },
  });

  const handleUpdateAnimeStatus = (option) => {
    update({ watchlistEntryId: anime._id, updates: { status: option.value } });
  };

  const handleDeleteWatchlistEntry = () => {
    deleteEntry({ watchlistEntryId: anime._id });
  };

  return (
    <motion.div className="relative pb-2">
      {deleteIsPending && <NyanLoader className="absolute top-2 right-2 h-5" />}
      {!deleteIsPending && (
        <div
          className="group absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg cursor-pointer"
          onClick={handleDeleteWatchlistEntry}
        >
          <TrashIcon className="h-5 group-hover:text-red-600" />
        </div>
      )}

      <img src={anime.thumbnail} alt={anime.title} />

      <div className="flex flex-col space-y-3 pt-2 pr-2 pl-1">
        <h4 className="text-[0.5rem] sm:text-xs md:text-sm lg:text-base font-[Lato] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
          {anime.title}
        </h4>

        {updateIsPending && (
          <div className="flex justify-center items-center w-full">
            <NyanLoader className="h-10" />
          </div>
        )}

        {!updateIsPending && (
          <DropdownThree
            options={statusOptions}
            initialSelectedIndex={statusOptions.findIndex(
              ({ value }) => value === anime.status
            )}
            dropdownName={"Status"}
            onOptionSelected={handleUpdateAnimeStatus}
          />
        )}
      </div>
    </motion.div>
  );
}

export default WatchlistCard;
