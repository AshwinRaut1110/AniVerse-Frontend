import { PhotoIcon } from "@heroicons/react/24/outline";
import React from "react";

function DefaultThumbnail() {
  return (
    <div
      className={`flex items-center justify-center bg-gray-300 rounded-md shadow-md py-5 px-3`}
    >
      <PhotoIcon className="text-white h-12" />
    </div>
  );
}

export default DefaultThumbnail;
