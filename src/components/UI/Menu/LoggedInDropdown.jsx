import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { authActions } from "../../../store/authSlice";

function LoggedInDropdown({ userRole }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <>
      <Link to="/profile">
        <div className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1">
          <p className="text-md">Profile</p>
          <p className="text-sm text-gray-400">
            View and make changes to your profile.
          </p>
        </div>
      </Link>

      <Link to="/browse">
        <div className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1">
          <p className="text-md">Browse</p>
          <p className="text-sm text-gray-400">
            Browse and discover new animes.
          </p>
        </div>
      </Link>

      <Link to="/manage">
        <div className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1">
          <p className="text-md">Manage Site</p>
          <p className="text-sm text-gray-400">Administer content and users.</p>
        </div>
      </Link>

      <div
        className="hover:bg-secondary-color cursor-pointer py-3 px-6 space-y-1"
        onClick={handleLogout}
      >
        <p className="text-md">Logout</p>
        <p className="text-sm text-gray-400">Log out of your account.</p>
      </div>
    </>
  );
}

export default LoggedInDropdown;
