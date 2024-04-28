import { Rating } from "react-simple-star-rating";
import defaultProfile from "../../assets/defaultProfile.jpg";
import CollapsableContent from "../UI/DisplayText/CollapsableContent";
import { getTitleFromRating } from "../../util/misc";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../store/NotificationSlice";
import { addReviewVote } from "../../util/http";
import { useState } from "react";
import NyanLoader from "../UI/NyanLoader";

function ReviewItem({ review }) {
  const dispatch = useDispatch();

  const formattedCreatedAtDate = new Date(review.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  // for showing changes on the client sides
  const [helpfulVotes, setHelpfulVotes] = useState(review.helpfulVotes);
  const [notHelpfulVotes, setNotHelpfulVotes] = useState(
    review.notHelpfulVotes
  );

  const totalVotes = helpfulVotes + notHelpfulVotes;

  // mutation for updating the review votes
  const { mutate, isPending } = useMutation({
    mutationFn: addReviewVote,
    onSuccess: (data) => {
      const isVoteHelpful = data.data.vote.helpful;

      // updating the local state to show changes on the frontend
      if (isVoteHelpful) {
        setHelpfulVotes((prevValue) => prevValue + 1);
        if (!data.data.isNew) setNotHelpfulVotes((prevValue) => prevValue - 1);
      } else {
        setNotHelpfulVotes((prevValue) => prevValue + 1);
        if (!data.data.isNew) setHelpfulVotes((prevValue) => prevValue - 1);
      }

      dispatch(
        notificationActions.showSuccessNotification({
          message: `review marked as ${
            isVoteHelpful ? "helpful" : "not helpful"
          }`,
        })
      );
    },
    onError: (error) => {
      dispatch(
        notificationActions.showErrorNotification({
          message: error.info?.message || "unable to save your vote.",
        })
      );
    },
  });

  const handleAddVote = (type) => {
    mutate({ animeId: review.anime, reviewId: review._id, type });
  };

  return (
    <div className="flex space-x-3 md:space-x-5">
      <div>
        <img
          src={review.user.profilePicture || defaultProfile}
          alt={review.user.username}
          className="w-12 md:w-28 rounded-full"
        />
      </div>

      <div className="flex flex-col py-1 w-full">
        <div className="flex flex-col space-y-2 md:space-y-3">
          <p className="font-[Lato] text-xs sm:text-sm md:text-base space-x-3">
            <span className="text-white font-bold">{review.user.username}</span>
            <span className="text-gray-400">{formattedCreatedAtDate}</span>
          </p>

          <Rating
            initialValue={review.rating}
            readonly
            allowFraction={true}
            SVGclassName="inline-block"
            size={25}
          />
        </div>

        {/* review  */}
        <div className="w-full space-y-3 py-3 font-[Lato]">
          <h4 className="text-white font-bold text-lg md:text-2xl">
            {review.title || getTitleFromRating(review.rating)}
          </h4>

          {review.review && (
            <CollapsableContent
              content={review.review}
              contentColor="text-white"
              textSize="text-xs md:text-sm lg:text-base"
              smallScreenContentHeight="70px"
              largeScreenContentHeight="80px"
            />
          )}
        </div>

        <h3 className="flex flex-col md:flex-row space-y-2 md:space-y-0 text-gray-400 font-[Lato] text-center md:text-start space-x-3 text-sm md:text-base">
          <span>
            {helpfulVotes} out of {totalVotes} people found this helpful. Was
            this review helpful to you?
          </span>

          <span className="flex items-center space-x-3">
            {isPending ? (
              <NyanLoader className="h-7" />
            ) : (
              <>
                <button
                  className="font-bold text-blue-400 transition-all duration-300 hover:underline hover:text-white"
                  onClick={() => handleAddVote("helpful")}
                >
                  YES
                </button>
                <div className="h-4 md:h-5 w-[1.7px] bg-gray-500" />
                <button
                  className="font-bold text-blue-400 transition-all duration-300 hover:underline hover:text-white"
                  onClick={() => handleAddVote("not-helpful")}
                >
                  NO
                </button>
              </>
            )}
          </span>
        </h3>
      </div>
    </div>
  );
}

export default ReviewItem;
