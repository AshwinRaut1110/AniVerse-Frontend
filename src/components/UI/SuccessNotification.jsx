import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../store/NotificationSlice";

function SuccessNotification({ title, message }) {
  const dispatch = useDispatch();

  const handleHideNotification = () => {
    dispatch(notificationActions.hideSuccessNotification());
  };

  return (
    <div className="flex items-center justify-center sticky bottom-14 w-full font-[Lato] rise-from-below-animation">
      <div className="z-20 relative flex items-center h-28 rounded-md w-full sm:w-[80%] md:w-[50%] lg:w-[40%] bg-secondary-color pl-10">
        <div className="absolute left-0 top-0 h-28 w-3 bg-green-500 rounded-tl-md rounded-bl-md"></div>
        <div className="bg-green-500 p-3 rounded-full">
          <CheckIcon className="h-8 text-white" />
        </div>
        <div className="flex-grow px-2 pl-5 text-white">
          <h3 className="text-xl font-semibold">{title || "Success"}</h3>
          <p>{message || "Attack on titan added successfully."}</p>
        </div>

        <XMarkIcon
          className="h-7 text-white absolute top-2 right-2 cursor-pointer"
          onClick={handleHideNotification}
        />
      </div>
    </div>
  );
}

export default SuccessNotification;
