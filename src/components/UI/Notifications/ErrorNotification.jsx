import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store/NotificationSlice";

function ErrorNotification({ message }) {
  const dispatch = useDispatch();

  const handleHideNotification = () => {
    dispatch(notificationActions.hideErrorNotification());
  };

  return (
    <div className="flex items-center justify-center sticky top-0 z-30 w-full font-[Lato] falling-down-animation bg-red-500 p-3 text-white">
      <p>{message || "Error"}</p>

      <XMarkIcon
        className="h-7 text-white absolute mt-auto mb-auto top-0 bottom-0 right-2 cursor-pointer"
        onClick={handleHideNotification}
      />
    </div>
  );
}

export default ErrorNotification;
