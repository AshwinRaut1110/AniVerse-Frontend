import { forwardRef, useEffect, useRef } from "react";
import Plyr from "plyr";
import Hls from "hls.js";

const Player = forwardRef(({ episode, play }, plyrInstanceRef) => {
  const containerRef = useRef(null);
  const hlsInstanceRef = useRef(null);

  useEffect(() => {
    if (!episode) return;

    // Cleanup existing instances before setting up new ones
    if (plyrInstanceRef.current) {
      plyrInstanceRef.current.destroy();
      plyrInstanceRef.current = null;
    }
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }

    // Create and configure the video element manually
    const videoElement = document.createElement("video");
    videoElement.setAttribute("playsinline", "");
    videoElement.setAttribute("controls", "");
    containerRef.current.innerHTML = ""; // Clear the container before appending
    containerRef.current.appendChild(videoElement);

    const hls = new Hls();
    hls.loadSource(episode.streamLink);
    hls.attachMedia(videoElement);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const availableQualities = Object.keys(episode.versions).filter(
        (quality) => episode.versions[quality]
      );
      setupPlyr(videoElement, availableQualities);
    });

    hlsInstanceRef.current = hls;

    const setupPlyr = (video, availableQualities) => {
      const plyr = new Plyr(video, {
        settings: ["quality", "speed", "loop"],
        quality: {
          forced: true,
          default: availableQualities[0],
          options: availableQualities,
          onChange: (quality) => {
            updateQuality(quality);
          },
        },
      });

      plyrInstanceRef.current = plyr;
    };

    const updateQuality = (newQuality) => {
      const hls = hlsInstanceRef.current;
      const levels = { 360: 0, 480: 1, 720: 2 };
      hls.currentLevel = levels[newQuality];
    };

    // Cleanup when the episode changes or component unmounts
    return () => {
      if (plyrInstanceRef.current) {
        plyrInstanceRef.current.destroy();
      }
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
      }
    };
  }, [episode]);

  return <div className={`${play ? "" : "hidden"}`} ref={containerRef}></div>;
});

export default Player;
