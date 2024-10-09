import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import DefaultThumbnail from "../../UI/DefaultThumbnail";
import { Draggable } from "react-beautiful-dnd";

function SectionContentItem({ onDeleteSectionContent, anime, index }) {
  return (
    <Draggable draggableId={anime._id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`flex space-x-5 p-3 ${
            snapshot.isDragging ? "bg-[#232323] rounded-lg" : ""
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {anime.thumbnail && (
            <img
              src={anime.thumbnail}
              className="h-28 rounded-md shadow-lg"
              alt={`${anime.names.english}'s thumbnail.`}
            />
          )}

          {!anime.thumbnail && <DefaultThumbnail />}

          <div className="flex w-full py-2">
            <div className="flex-grow">
              <p className="text-lg font-[Lato] text-gray-300 font-bold">
                {anime.names.english}
              </p>
              <p className="text-sm font-[Lato] text-gray-300 font-bold">
                {anime.names.japanese}
              </p>
            </div>

            <div className="flex items-center justify-center px-5">
              <TrashIcon
                className="text-gray-200 hover:text-[#e63946] h-7 cursor-pointer"
                onClick={() => onDeleteSectionContent(index)}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default SectionContentItem;
