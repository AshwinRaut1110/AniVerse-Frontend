import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function ErrorComponent({ className, errors, onHideError }) {

  return (
    <div
      className={`relative flex flex-col items-center bg-red-500 mb-5 p-3 rounded-md font-[Lato] ${
        className || ""
      }`}
    >
      {errors.split(";").map((error) => (
        <p className="text-white" key={error}>
          {error}
        </p>
      ))}
      <XMarkIcon
        className="absolute top-3 right-2 h-7 text-red-300 hover:text-white cursor-pointer"
        onClick={onHideError}
      />
    </div>
  );
}

export default ErrorComponent;
