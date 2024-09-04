import { useParams } from "react-router-dom";
import Player from "./Player";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import VideoControlBar from "./VideoControlBar";

function EpisodePlayer({ isPending, isError, error, data }) {
  const { episodeIdentifier } = useParams();
  const plyrInstanceRef = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(false);
  }, [episodeIdentifier]);

  return (
    <div className="w-[100%] lg:w-[70%] xl:w-[57%]">
      {/* display the thumbnail if we are not playing the video */}
      {!play && (
        <div className="relative w-full">
          <div className="w-full h-full bg-black opacity-10 z-10 absolute top-0 left-0" />
          <img
            src="http://127.0.0.1:9000/aniverse/anime_banners/661f4b25da3a6f1dd26bbfdc.webp"
            alt={"Episode Thumbnail"}
          />
          <button
            className="flex w-20 h-20 md:w-28 md:h-28 bg-primary-blue rounded-full items-center justify-center border-[5px] border-white absolute top-0 bottom-0 right-0 left-0 mr-auto ml-auto mt-auto mb-auto pl-1 shadow-lg z-20"
            onClick={() => {
              setPlay(true);
              plyrInstanceRef.current?.play();
            }}
          >
            <PlayIcon className="text-white w-12 md:w-16" />
          </button>
        </div>
      )}
      {data && (
        <Player episode={data.data.episode} ref={plyrInstanceRef} play={play} />
      )}
      <VideoControlBar />
    </div>
  );
}

export default EpisodePlayer;
