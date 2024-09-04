import {
  ArrowsPointingOutIcon,
  PlayIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/solid";
import React from "react";

function ControlButton({ buttonText, ButtonIcon }) {
  return (
    <button className="flex items-center space-x-1 text-gray-400">
      <ButtonIcon className="h-5" />
      <span className="font-[Lato]">{buttonText}</span>
    </button>
  );
}

function VideoControlBar() {
  return (
    <div className="flex items-center w-full h-10 px-2 space-x-3 rounded-bl-md rounded-br-md bg-[#151515]">
      <ControlButton ButtonIcon={ArrowsPointingOutIcon} buttonText="Expand" />
      <ControlButton ButtonIcon={PlayIcon} buttonText="Autoplay" />
      <ControlButton ButtonIcon={BackwardIcon} buttonText="Prev" />
      <ControlButton ButtonIcon={ForwardIcon} buttonText="Next" />
    </div>
  );
}

export default VideoControlBar;
