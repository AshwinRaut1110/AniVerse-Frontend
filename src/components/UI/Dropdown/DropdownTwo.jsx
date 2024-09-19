import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

function DropdownTwo({
  options,
  onOptionSelected,
  initialSelectedIndex,
  className,
}) {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleDropdown = () => {
    setIsExpanded((prevValue) => !prevValue);
  };

  const handleDropdownOptionSelected = (index) => {
    setSelectedIndex(index);
    setIsExpanded(false);
    onOptionSelected(options[index]);
  };

  return (
    <div className={`relative ${className || ""}`}>
      <span
        className="flex items-center justify-center space-x-2 w-full h-full bg-[#212121] border border-[#171717] shadow-md rounded-md p-1 text-gray-400 cursor-pointer select-none"
        onClick={handleToggleDropdown}
      >
        {/* dropdown header */}
        <span className="text-sm font-medium">
          {options[selectedIndex].title}
        </span>
        <motion.span
          animate={{
            rotate: isExpanded ? 180 : 0,
            transition: { type: "spring", duration: 0.5 },
          }}
        >
          <ChevronDownIcon className="h-4" />
        </motion.span>
      </span>

      {/* dropdown options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute w-28 max-w-28 top-10 flex flex-col bg-[#212121] border border-[#171717] shadow-md rounded-md py-2 text-gray-400 cursor-pointer select-none z-50"
          >
            {options.map(({ title }, index) => (
              <span
                className={`flex items-center justify-center w-full bg-[#212121] p-1 cursor-pointer select-none hover:bg-[#313131] ${
                  selectedIndex === index ? "bg-[#313131] text-[#1d94ff]" : ""
                }`}
                key={title}
                onClick={() => handleDropdownOptionSelected(index)}
              >
                {title}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DropdownTwo;
