import React, { useCallback, useEffect, useRef, useState } from "react";

function Dropdown({ options, defaultIndex, title, useTitle, DropdownIcon }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownHeaderButtonRef = useRef();

  const [dropdownOptions, setDropdownOptions] = useState(
    options.map((option, index) => ({
      value: option,
      selected: index === defaultIndex,
    }))
  );

  const selectedItemIndex = dropdownOptions.findIndex(
    (option) => option.selected
  );

  const selectedItem = dropdownOptions[selectedItemIndex];

  const handleClickedOutside = useCallback(
    (e) => {
      if (e.target === dropdownHeaderButtonRef.current) return;
      setIsDropdownOpen(false);
    },
    [setIsDropdownOpen]
  );

  const handleToggleDropdownMenu = (e) => {
    // e.stopPropagation();
    setIsDropdownOpen((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      // adding click listener on the window object to close the dropdown when the use clicks outside
      window.addEventListener("click", handleClickedOutside);
    } else {
      window.removeEventListener("click", handleClickedOutside);
    }

    () => {
      window.removeEventListener("click", handleClickedOutside);
    };
  }, [isDropdownOpen]);

  const handleDropdownOptionSelected = (selectedItemIndex) => {
    setDropdownOptions((prevValue) => {
      const updatedOptions = [...prevValue].map((option, index) => ({
        ...option,
        selected: index === selectedItemIndex,
      }));

      return updatedOptions;
    });
  };

  return (
    <div className="relative">
      {/* dropdown header */}
      <button
        className="flex items-center bg-transparent py-3 px-4 text-gray-300 uppercase hover:bg-secondary-color font-[Lato] font-bold"
        ref={dropdownHeaderButtonRef}
        onClick={handleToggleDropdownMenu}
      >
        <DropdownIcon className="h-6 mr-1" />
        {useTitle ? title : selectedItem?.value || title}
      </button>

      {/* dropdown list */}
      {isDropdownOpen && (
        <div className="absolute top-[2.4rem] bg-secondary-color py-5 min-w-52 z-30">
          {dropdownOptions.map((option, index) => (
            <li
              className={`${
                index === selectedItemIndex
                  ? "text-white bg-[#2b2b2b]"
                  : "text-gray-400"
              } list-none py-3 px-6 cursor-pointer hover:bg-[#050505] hover:text-white`}
              key={index}
              onClick={() => handleDropdownOptionSelected(index)}
            >
              {option.value}
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
