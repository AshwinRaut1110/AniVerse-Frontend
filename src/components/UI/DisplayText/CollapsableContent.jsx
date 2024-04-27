import React, { useEffect, useRef, useState } from "react";
import { getScreenDimensions } from "../../../util/misc";

function CollapsableContent({ content, contentColor, shadowColor }) {
  // states
  const [showFullContent, setShowFullContent] = useState(false);

  // if the content is more than the default height of the content div
  const [contentIsOverflowing, setContentIsOverflowing] = useState(false);

  const contentDivRef = useRef();

  // calculate the default content div height
  let defaultContentHeight = ["xs", "sm"].includes(getScreenDimensions())
    ? "90px"
    : "144px";

  if (!contentIsOverflowing) defaultContentHeight = "50px";

  // calculate the default shadow height
  const defaultShadowHeight = ["xs", "sm"].includes(getScreenDimensions())
    ? "10px"
    : "25px";

  const handleToggleShowContent = () => {
    setShowFullContent((prevValue) => !prevValue);
  };

  // break the text content up based on new lines
  const contentParagraphs = content
    .split("\n")
    .filter((para) => para.trim() !== "");

  useEffect(() => {
    if (contentDivRef.current.clientHeight < contentDivRef.current.scrollHeight)
      setContentIsOverflowing(true);
  }, []);

  return (
    <div className="mt-3 w-[100%] md:w-[90%] text-[0.5rem] sm:text-xs md:text-sm lg:text-base">
      <div
        className={`relative w-full trasnition-[height] duration-500 ease-in-out overflow-hidden space-y-2`}
        ref={contentDivRef}
        style={{
          height: showFullContent
            ? contentDivRef.current.scrollHeight + "px"
            : defaultContentHeight,
        }}
      >
        {contentParagraphs.map((paragraph, index) => (
          <p key={index} className={contentColor}>
            {paragraph}
          </p>
        ))}
        {!showFullContent && contentIsOverflowing && (
          <div
            className={`absolute bottom-0 h-[${defaultShadowHeight}] ${shadowColor} w-full`}
          />
        )}
      </div>

      {contentIsOverflowing && (
        <button
          className="text-gray-400 hover:text-gray-100 font-[Lato] font-bold text-[0.5rem] md:text-xs"
          onClick={handleToggleShowContent}
        >
          {showFullContent ? "SHOW LESS" : "SHOW MORE"}
        </button>
      )}
    </div>
  );
}

export default CollapsableContent;
