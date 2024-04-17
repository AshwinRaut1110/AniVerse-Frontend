import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserIcon } from "@heroicons/react/24/outline";
import { authModalActions } from "../store/authModalSlice";
import { Link } from "react-router-dom";
import { authActions } from "../store/authSlice";

function MainNavigation() {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const handleToggleDropdown = () => {
    setShowDropdown((prevValue) => !prevValue);
  };

  const handleLoginClick = () => {
    dispatch(authModalActions.changeCurrentPage("login"));
  };

  const handleSignUpClick = () => {
    dispatch(authModalActions.changeCurrentPage("signup"));
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  // for handling closing the dropdown on mouse clicked outside
  // useEffect(() => {}, [showDropdown]);

  return (
    <header className="flex justify-between items-center bg-secondary-color px-5 py-[0.8rem]">
      <Link to="/">
        <h1
          // className="text-5xl font-bold text-gradient-animation select-none"
          className="text-5xl font-bold select-none"
        >
          <span className="text-[#007bff]">AniVerse</span>
          {/* <span className="text-orange-500">Verse</span> */}
        </h1>
      </Link>

      <div className="relative flex flex-grow justify-end">
        <div
          className={`p-2 cursor-pointer ${
            showDropdown ? "rounded-full border-white border-2" : ""
          }`}
        >
          <UserIcon
            className={`text-white h-7`}
            onClick={handleToggleDropdown}
          />
        </div>

        {/* dropdown menu */}
        {showDropdown && (
          <div
            className="absolute right-0 top-[4.3rem] text-white font-[Lato] space-y-2 bg-black py-2 rounded-md shadow-lg falling-down-animation z-10"
            ref={dropdownRef}
            onClick={handleCloseDropdown}
          >
            {/* options if the user is not logged in */}
            {!user.user && (
              <>
                {/* login option */}
                <div
                  className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1"
                  onClick={handleSignUpClick}
                >
                  <p className="text-md">Create An Account</p>
                  <p className="text-sm text-gray-400">
                    Connect with an awesome anime community.
                  </p>
                </div>

                {/* create account option */}
                <div
                  className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1"
                  onClick={handleLoginClick}
                >
                  <p className="text-md">Log In</p>
                  <p className="text-sm text-gray-400">
                    Already have an account. Welcome back!
                  </p>
                </div>
              </>
            )}

            {/* options if the user is logged in */}
            {user.user && (
              <>
                <Link to="/profile">
                  <div className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1">
                    <p className="text-md">Profile</p>
                    <p className="text-sm text-gray-400">
                      View and make changes to your profile.
                    </p>
                  </div>
                </Link>

                <div className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1">
                  <p className="text-md">Browse</p>
                  <p className="text-sm text-gray-400">
                    Browse and discover new animes.
                  </p>
                </div>

                <div
                  className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1"
                  onClick={handleLogout}
                >
                  <p className="text-md">Logout</p>
                  <p className="text-sm text-gray-400">
                    Log out of your account.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default MainNavigation;
