import React from "react";
import { authModalActions } from "../../../store/authModalSlice";
import { useDispatch } from "react-redux";

function NoLoginDropdown() {
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    dispatch(authModalActions.changeCurrentPage("login"));
  };

  const handleSignUpClick = () => {
    dispatch(authModalActions.changeCurrentPage("signup"));
  };

  return (
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
  );
}

export default NoLoginDropdown;
