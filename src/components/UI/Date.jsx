import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import React, { useRef } from "react";

function Date({ className, ...props }) {
  const dateInputRef = useRef();

  const handleOpenCalender = () => {
    dateInputRef.current.showPicker();
  };

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
      />
      <CalendarDaysIcon className="absolute top-0 bottom-0 mt-auto mb-auto right-5 text-white h-7" />
    </div>
  );
}

export default Date;
