import { useMutation } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SectionContent from "./SectionContent";
import {
  deleteHomePageSection,
  queryClient,
  updateHomePageSection,
} from "../../../util/http";
import { motion } from "framer-motion";
import Input from "../../UI/Inputs/Input";
import SearchBar from "../../Browse/SearchBar";
import ErrorComponent from "../../UI/ErrorComponent";
import { notificationActions } from "../../../store/NotificationSlice";
import NyanLoader from "../../UI/NyanLoader";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  deleteSectionDataSetter,
  swipeDownDataSetter,
  swipeUpDataSetter,
} from "./queryDataSetters";

function SectionItem({ section, pageIndex, index }) {
  const [sectionData, setSectionData] = useState(section);

  const sectionContentRef = useRef(null);

  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  // update section mutation
  const {
    mutate: mutateUpdate,
    isError: isErrorUpdate,
    isPending: isPendingUpdate,
  } = useMutation({
    mutationFn: updateHomePageSection,
    onSuccess(data, context) {
      if (!context.sectionData.order) {
        setSectionData(data.data.updatedSection);
        sectionContentRef.current.setSectionContent(
          data.data.updatedSection.content
        );
      }

      queryClient.invalidateQueries({ queryKey: ["homepagesections"] });

      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: "Section was updated successfully.",
        })
      );
    },
    onError(error) {
      setError(error?.info?.message || "Something went wrong.");
    },
  });

  // delete section mutation
  const {
    mutate: mutateDelete,
    isError: isErrorDelete,
    isPending: isPendingDelete,
  } = useMutation({
    mutationFn: deleteHomePageSection,
    onSuccess() {
      queryClient.setQueryData(["homepagesections"], function (oldData) {
        return deleteSectionDataSetter(oldData, pageIndex, index);
      });

      queryClient.invalidateQueries({ queryKey: ["homepagesections"] });

      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: "Section was deleted successfully.",
        })
      );
    },
    onError(error) {
      setError(error?.info?.message || "Something went wrong.");
    },
  });

  const handleSearchResultClicked = (anime) => {
    sectionContentRef.current.setSectionContent((prevValue) => {
      for (let i = 0; i < prevValue.length; i++)
        if (prevValue[i].anime._id === anime._id) return prevValue;

      return [...prevValue, { anime }];
    });
  };

  const handleNestedValueChanged = (field, value) => {
    setSectionData((prevValue) => ({ ...prevValue, [field]: value }));
  };

  const handleUpdateSection = () => {
    let updateData = {};

    if (section.sectionType === "showcase") {
      if (!sectionData.title || section.title.trim() >= 10) return;
      if (!sectionData.subtitle || section.subtitle.trim() >= 10) return;

      updateData = {
        title: sectionData.title,
        subtitle: sectionData.subtitle,
      };
    }

    updateData.content = sectionContentRef.current.sectionContent;

    mutateUpdate({ sectionData: updateData, sectionId: section._id });
  };

  const handleSwapUp = () => {
    // don't swap up the very first element in the list
    if (pageIndex === 0 && index === 0) return;

    let otherId;

    queryClient.setQueryData(["homepagesections"], (oldData) => {
      const { updatedData, otherSectionId } = swipeUpDataSetter(
        oldData,
        pageIndex,
        index
      );

      otherId = otherSectionId;

      return updatedData;
    });

    mutateUpdate({
      sectionData: { order: { other: otherId } },
      sectionId: section._id,
    });
  };

  const handleSwapDown = () => {
    let otherId;

    queryClient.setQueryData(["homepagesections"], (oldData) => {
      const { updatedData, otherSectionId } = swipeDownDataSetter(
        oldData,
        pageIndex,
        index
      );
      otherId = otherSectionId;
      return updatedData;
    });

    if (otherId)
      mutateUpdate({
        sectionData: { order: { other: otherId } },
        sectionId: section._id,
      });
  };

  const handleDeleteSection = () => {
    mutateDelete({ sectionId: section._id });
  };

  return (
    <div className="w-full bg-[#101010] rounded-lg px-5 py-10 shadow-lg">
      {(isErrorUpdate || isErrorDelete) && error && (
        <ErrorComponent
          errors={error || "Something went wrong."}
          onHideError={() => setError(null)}
        />
      )}

      {section.sectionType === "showcase" && (
        <form className="w-full">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Section title"
              id="section-title"
              value={sectionData.title}
              onChange={(e) =>
                handleNestedValueChanged("title", e.target.value)
              }
            />
            <Input
              label="Section subtitle"
              id="section-subtitle"
              value={sectionData.subtitle}
              onChange={(e) =>
                handleNestedValueChanged("subtitle", e.target.value)
              }
            />
          </div>
        </form>
      )}

      <div className="w-full py-5">
        <SearchBar
          searchBarColor="bg-[#202020]"
          placeholder={`Search for an anime to add to this ${section.sectionType} section...`}
          onSearchResultClicked={handleSearchResultClicked}
        />

        {/* content cards */}
        <SectionContent ref={sectionContentRef} content={section.content} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            className="bg-white text-black shadow-md rounded-md p-3 hover:bg-primary-blue hover:text-white"
            onClick={handleSwapUp}
          >
            <ArrowUpIcon className="h-6" />
          </button>

          <button
            className="bg-white text-black shadow-md rounded-md p-3 hover:bg-primary-blue hover:text-white"
            onClick={handleSwapDown}
          >
            <ArrowDownIcon className="h-6" />
          </button>

          <button
            className="bg-white text-black shadow-md rounded-md p-3 hover:bg-[#e63946] hover:text-white"
            onClick={handleDeleteSection}
          >
            <TrashIcon className="h-6" />
          </button>
        </div>

        {!isPendingUpdate && !isPendingDelete && (
          <motion.button
            className="flex items-center justify-center bg-primary-blue hover:bg-hover-blue px-10 py-5 outline-none rounded-full text-white space-x-1 font-[Lato] font-bold"
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.4 }}
            onClick={handleUpdateSection}
          >
            Save Changes
          </motion.button>
        )}

        {(isPendingUpdate || isPendingDelete) && (
          <NyanLoader className="h-14" />
        )}
      </div>
    </div>
  );
}

export default SectionItem;
