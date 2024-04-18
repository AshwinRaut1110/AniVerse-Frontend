import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import React, { useRef } from "react";

function DateInput({ value, className, ...props }) {
  const dateInputRef = useRef();

  const handleOpenCalender = () => {
    dateInputRef.current.showPicker();
  };

  // formatting the date string to the format required
  let formattedDateString = "";

  if (value !== "") {
    const date = new Date(value);

    const day = date.toLocaleDateString("en-US", {
      day: "2-digit",
    });

    const month = date.toLocaleDateString("en-US", {
      month: "2-digit",
    });

    const year = date.toLocaleDateString("en-US", {
      year: "numeric",
    });

    formattedDateString = `${year}-${month}-${day}`;
  }

  return (
    <div
      className="cursor-pointer relative border border-[#ddd] outline-none rounded-md"
      onClick={handleOpenCalender}
    >
      <input
        type="date"
        className={`bg-transparent text-white border #ddd rounded-sm px-5 outline-none border-none w-full h-full ${
          className || ""
        }`}
        {...props}
        ref={dateInputRef}
        value={formattedDateString}
      />
      <CalendarDaysIcon className="absolute top-0 bottom-0 mt-auto mb-auto right-5 text-white h-7" />
    </div>
  );
}

export default DateInput;
