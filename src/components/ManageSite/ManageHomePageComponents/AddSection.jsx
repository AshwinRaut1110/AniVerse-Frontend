import { PlusIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Input from "../../UI/Inputs/Input";
import DropdownThree from "../../UI/Dropdown/DropdownThree";
import SearchBar from "../../Browse/SearchBar";
import SectionContent from "./SectionContent";
import { useMutation } from "@tanstack/react-query";
import { addNewSection, queryClient } from "../../../util/http";
import ErrorComponent from "../../UI/ErrorComponent";
import NyanLoader from "../../UI/NyanLoader";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store/NotificationSlice";
import { SECTION_TYPE_OPTIONS } from "../../../util/constants";

const INITIAL_SECTION_DATA = {
  sectionType: "featured",
  title: "",
  subtitle: "",
};

function AddSection() {
  const [showAddSection, setShowAddSection] = useState(false);

  const [sectionData, setSectionData] = useState(INITIAL_SECTION_DATA);

  const sectionContentRef = useRef(null);

  const [error, setError] = useState();

  const dispatch = useDispatch();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: addNewSection,
    onSuccess() {
      setSectionData(INITIAL_SECTION_DATA);
      sectionContentRef.current.setSectionContent([]);

      queryClient.invalidateQueries({ queryKey: ["homepagesections"] });

      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: "New section was added successfully.",
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

  const handleAddNewSection = () => {
    if (
      sectionData.sectionType === "showcase" &&
      (sectionData.title.trim().length < 10 ||
        sectionData.subtitle.trim().length < 10)
    )
      return;

    if (sectionContentRef.current.sectionContent.length === 0) return;

    const newSectionData = {
      title: sectionData.title,
      subtitle: sectionData.subtitle,
      sectionType: sectionData.sectionType,
      content: sectionContentRef.current.sectionContent.map((item) => {
        const anime = { anime: item.anime._id };
        if (item._id) anime._id = item._id;

        return anime;
      }),
    };

    mutate({ sectionData: newSectionData });
  };

  return (
    <div className="flex flex-col space-y-10 w-full">
      <div className="w-full flex items-center justify-end">
        <motion.button
          className="flex items-center justify-center bg-primary-blue hover:bg-hover-blue px-7 py-5 outline-none rounded-full text-white space-x-1 font-[Lato] font-bold"
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.4 }}
          onClick={() => setShowAddSection((prevValue) => !prevValue)}
        >
          <span className="text-lg">Add New Section</span>
          <PlusIcon className="h-7" strokeWidth={2} />
        </motion.button>
      </div>

      {showAddSection && (
        <motion.div
          className="text-white w-full"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.form className="w-full">
            {isError && error && (
              <ErrorComponent
                errors={error || "Something went wrong."}
                onHideError={() => setError(null)}
              />
            )}

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
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
              <DropdownThree
                options={SECTION_TYPE_OPTIONS}
                initialSelectedIndex={0}
                height={14}
                dropdownName="Section Type"
                onOptionSelected={(option) =>
                  handleNestedValueChanged("sectionType", option.value)
                }
              />
            </div>
          </motion.form>

          <div className="w-full py-5">
            <h3 className="text-3xl font-bold font-[Lato] text-[#DDDDDD] my-3">
              Section Content
            </h3>

            <SearchBar
              searchBarColor="bg-[#101010]"
              placeholder="Search for an anime to add to featured list..."
              onSearchResultClicked={handleSearchResultClicked}
            />

            {/* content cards */}
            <SectionContent ref={sectionContentRef} />
          </div>

          <div className="flex items-center justify-end">
            {!isPending && (
              <motion.button
                className="flex items-center justify-center bg-primary-blue hover:bg-hover-blue px-10 py-5 outline-none rounded-full text-white space-x-1 font-[Lato] font-bold"
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.4 }}
                onClick={handleAddNewSection}
              >
                Add Section
              </motion.button>
            )}

            {isPending && <NyanLoader className="h-14" />}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AddSection;
