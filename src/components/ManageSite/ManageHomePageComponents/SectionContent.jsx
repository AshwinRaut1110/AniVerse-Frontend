import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SectionContentItem from "./SectionContentItem";

const SectionContent = forwardRef(function ({ content, sectionId }, ref) {
  const [sectionContent, setSectionContent] = useState([]);

  useImperativeHandle(ref, () => {
    return {
      sectionContent,
      setSectionContent,
    };
  });

  useEffect(() => {
    if (!content) return;
    setSectionContent(content);
  }, [content]);

  const handleDeleteSectionContent = (index) => {
    setSectionContent((prevValue) =>
      prevValue.filter((anime, i) => index !== i)
    );
  };

  const handleSectionItemsReordered = (result) => {
    const { destination, source } = result;

    // if destination is null, that means the item was dropped outside the droppable
    if (!destination) return;

    // check if the location of the item was actually changed or not
    if (destination.index === source.index) return;

    setSectionContent((prevValue) => {
      const movedElement = prevValue[source.index];
      const updatedSectionItemsList = JSON.parse(JSON.stringify(prevValue));

      // remove the moved element from the orignal list and add it to it new position
      updatedSectionItemsList.splice(source.index, 1);
      updatedSectionItemsList.splice(destination.index, 0, movedElement);

      return updatedSectionItemsList;
    });
  };

  return (
    <DragDropContext onDragEnd={handleSectionItemsReordered}>
      <Droppable droppableId={sectionId || "section-cotent"}>
        {(provided) => (
          <div
            className="w-full py-3"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sectionContent.map(({ anime }, index) => (
              <SectionContentItem
                key={anime._id}
                anime={anime}
                onDeleteSectionContent={handleDeleteSectionContent}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export default SectionContent;
