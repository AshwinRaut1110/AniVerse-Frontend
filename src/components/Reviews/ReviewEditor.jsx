import React from "react";
import { useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";

function ReviewEditor() {
  const { profilePicture, username } = useSelector((state) => state.auth.user);

  return (
    <div className="w-full md:w-[80%] mx-auto bg-secondary-color p-4">
      {/* head and rating section */}
      <div className="flex space-x-5">
        <img
          src={profilePicture}
          alt={username}
          className="w-16 md:w-28 rounded-full"
        />

        <div className="flex py-1 w-full items-center justify-between">
          <div className="flex flex-col space-y-2 md:space-y-3">
            <p className="font-[Lato] text-xs sm:text-sm md:text-base">
              <span className="text-gray-300">Review as</span>{" "}
              <span className="text-white font-bold">{username}</span>
            </p>

            <Rating
              initialValue={3}
              allowFraction={true}
              SVGclassName="inline-block"
              size={25}
            />
          </div>

          <button className="bg-[#007bff] hover:bg-[#1385ff] text-white px-3 md:px-5 lg:px-7 py-2 md:py-4 text-[0.7rem] md:text-lg lg:text-xl font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none">
            Add a review
          </button>
        </div>
      </div>

      {/* review section */}
      <div></div>
    </div>
  );
}

export default ReviewEditor;
