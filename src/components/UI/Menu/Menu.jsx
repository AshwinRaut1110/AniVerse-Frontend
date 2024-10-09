import React, { useCallback, useEffect, useRef, useState } from "react";
import NoLoginDropdown from "./NoLoginDropdown";
import LoggedInDropdown from "./LoggedInDropdown";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { UserIcon } from "@heroicons/react/24/outline";

function OptionsDropdown() {
  const user = useSelector((state) => state.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const handleToggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prevValue) => !prevValue);
  };

  const handleClickedOutside = useCallback(() => {
    setShowDropdown(false);
  }, [setShowDropdown]);

  // for handling closing the dropdown on mouse clicked outside
  useEffect(() => {
    if (showDropdown) {
      // adding click listener on the window object to close the dropdown when the use clicks outside
      window.addEventListener("click", handleClickedOutside);
    } else {
      window.removeEventListener("click", handleClickedOutside);
    }

    () => {
      window.removeEventListener("click", handleClickedOutside);
    };
  }, [showDropdown]);

  return (
    <>
      <div className="cursor-pointer" onClick={handleToggleDropdown}>
        {!user.user?.profilePicture ? (
          <UserIcon className="text-white h-7" />
        ) : (
          <img src={user.user.profilePicture} className="h-12 rounded-full" />
        )}
      </div>

      {/* dropdown menu */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            animate={{
              y: [-30, 0],
              opacity: [0, 1],
            }}
            exit={{ y: [0, -10], opacity: [1, 0] }}
            className="absolute right-0 top-[4.3rem] text-white font-[Lato] space-y-2 bg-black py-2 rounded-md shadow-lg z-50"
            ref={dropdownRef}
            onClick={handleToggleDropdown}
          >
            {/* options if the user is not logged in */}
            {!user.user && <NoLoginDropdown />}

            {/* options if the user is logged in */}
            {user.user && <LoggedInDropdown userRole={user.user.role} />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default OptionsDropdown;
