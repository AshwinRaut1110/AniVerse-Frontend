import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import Input from "../UI/Inputs/Input";
import TextareaInput from "../UI/Inputs/TextareaInput";
import { getScreenDimensions, hasMinLength } from "../../util/misc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserReview, queryClient, updateAReview } from "../../util/http";
import { useParams } from "react-router-dom";
import ErrorComponent from "../UI/ErrorComponent";
import NyanLoader from "../UI/NyanLoader";
import { authModalActions } from "../../store/authModalSlice";
import { notificationActions } from "../../store/NotificationSlice";
import defaultProfile from "../../assets/defaultProfile.jpg";

function ReviewEditor() {
  const { animeId } = useParams();

  // get the user credentials if he's logged in
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const isLoggedIn = !!user;

  const profilePicture = user?.profilePicture;
  const username = user?.username;

  const isSmallScreen = ["xs", "sm"].includes(getScreenDimensions());

  // states
  const [showAddReviewSection, setShowAddReviewSection] = useState(false);

  const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);

  const [showFetchError, setShowFetchError] = useState(false);

  const [reviewUpdateError, setReviewUpdateError] = useState("");

  const [review, setReview] = useState({
    rating: "",
    title: "",
    review: "",
  });

  const spoilerCheckBoxRef = useRef();

  // fetch the user's existing review
  const {
    data: reviewData,
    isError: fetchIsError,
    error: fetchError,
    isPending: fetchIsPending,
  } = useQuery({
    queryKey: ["reviews", animeId, username],
    queryFn: ({ signal }) => getUserReview(animeId, signal),
    enabled: isLoggedIn,
  });

  // check if the review is new
  const reviewIsNew = useMemo(() => !reviewData?.data?.review, [reviewData]);

  // mutation for creating and updating the review
  const { mutate: updateReview, isPending: reviewUpdateIsPending } =
    useMutation({
      mutationFn: updateAReview,
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["reviews", animeId],
        });

        setShowAddReviewSection(false);

        dispatch(
          notificationActions.showSuccessNotification({
            message: `Review ${
              reviewIsNew ? "added" : "updated"
            } successfully.`,
          })
        );
      },
      onError(error) {
        setReviewUpdateError(error);
      },
    });

  // check if the review is valid
  const isReviewValid =
    showAddReviewSection &&
    hasMinLength(review.title, 10) &&
    hasMinLength(review.review, 100);

  const handleShowAddReviewSection = () => {
    setShowAddReviewSection(true);
  };

  const handleCloseAddReviewSection = () => {
    setShowAddReviewSection(false);
  };

  const handleReviewChanged = (field, value) => {
    setReview((prevValue) => ({ ...prevValue, [field]: value }));
  };

  const handleHideReviewUpdateError = () => {
    setReviewUpdateError(false);
  };

  const handleOnChecked = (e) => {
    setIsSpoilerChecked(e.target.checked);
  };

  // handle review creation and update
  const handleSubmitReview = () => {
    const newReview = {
      rating: review.rating,
      title: review.title,
      review: review.review,
    };

    newReview.spoiler = spoilerCheckBoxRef.current.checked;

    updateReview({
      review: newReview,
      animeId,
      reviewIsNew,
    });
  };

  const handleReviewRatingChanged = (rating) => {
    updateReview({ review: { rating }, animeId, reviewIsNew });
  };

  // check for fetching errors
  useEffect(() => {
    if (reviewData?.data?.review) {
      const existingReview = { ...reviewData.data.review };
      existingReview.title = existingReview.title || "";
      existingReview.review = existingReview.review || "";
      setReview(existingReview);
    }

    if (fetchIsError) {
      if (fetchError.code === 404) return;

      setShowFetchError(true);
    }
  }, [reviewData, fetchIsError]);

  // add review button content
  const buttonContent = !showAddReviewSection && (
    <button
      className={`bg-[#007bff] hover:bg-[#1385ff] text-white px-3 md:px-5 lg:px-7 py-3 md:py-4 text-[0.9rem] md:text-base font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none ${
        isSmallScreen ? "mt-4 w-full" : ""
      }`}
      onClick={handleShowAddReviewSection}
    >
      {!review.review ? "ADD A REVIEW" : "UPDATE YOUR REVIEW"}
    </button>
  );

  // default message box when not logged in
  if (!isLoggedIn) {
    return (
      <div
        className="flex flex-col items-center justify-center space-y-3
       w-full md:w-[80%] mx-auto bg-secondary-color px-5 py-7 font-[Lato]"
      >
        <h4 className="text-2xl text-white font-semibold">Account Required</h4>
        <p className="text-gray-300">
          Please{" "}
          <span
            onClick={() =>
              dispatch(authModalActions.changeCurrentPage("login"))
            }
            className="text-blue-base hover:text-white hover:underline cursor-pointer transition-all duration-300"
          >
            Log In
          </span>{" "}
          or{" "}
          <span
            onClick={() =>
              dispatch(authModalActions.changeCurrentPage("signup"))
            }
            className="text-blue-base hover:text-white hover:underline cursor-pointer transition-all duration-300"
          >
            Create An Account
          </span>{" "}
          to add a review
        </p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[80%] mx-auto bg-secondary-color p-4">
      {/* Loader */}
      {fetchIsPending && <NyanLoader className="mx-auto h-20" />}

      {/* error */}
      {showFetchError && (
        <ErrorComponent
          errors={fetchError.info?.message || "Unable to fetch"}
          onHideError={() => setShowFetchError(false)}
        />
      )}

      {!fetchIsPending && (
        <>
          {/* head and rating section */}
          <div className="flex space-x-5">
            <img
              src={profilePicture || defaultProfile}
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
                  initialValue={review.rating}
                  allowFraction={true}
                  SVGclassName="inline-block"
                  size={25}
                  showTooltip
                  tooltipDefaultText="Rate this anime"
                  tooltipArray={[
                    "Appalling",
                    "Horrible",
                    "Very Bad",
                    "Bad",
                    "Average",
                    "Fine",
                    "Good",
                    "Very Good",
                    "Great",
                    "Masterpiece",
                  ]}
                  onClick={handleReviewRatingChanged}
                />
              </div>

              {!isSmallScreen && buttonContent}
            </div>
          </div>

          {isSmallScreen && buttonContent}

          {/* review section */}
          {showAddReviewSection && (
            <div className="md:pl-[8.25rem] md:pr-3 pt-5 md:pt-0 w-full font-[Lato] space-y-5">
              {reviewUpdateError && (
                <ErrorComponent
                  errors={
                    reviewUpdateError.info?.message ||
                    "unable to update the review."
                  }
                  onHideError={handleHideReviewUpdateError}
                />
              )}
              <Input
                id="input"
                label="Add A Title"
                value={review.title}
                onChange={(e) => handleReviewChanged("title", e.target.value)}
              />

              <TextareaInput
                id="review-body"
                label="Write A Review"
                value={review.review}
                onChange={(e) => handleReviewChanged("review", e.target.value)}
                rows={isSmallScreen ? 6 : 10}
              />

              {/* mark as spoiler */}
              <label
                htmlFor="spoilercheckbox"
                className="inline-flex font-[Lato] text-gray-400 hover:text-white group transition-colors duration-[0.2s] ease-linear cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="spoilercheckbox"
                  className="hidden"
                  onChange={handleOnChecked}
                  ref={spoilerCheckBoxRef}
                />
                <div
                  className={`flex text-[#a0a0a0] h-5 w-5 relative box-border bg-[#192e38] border-[0.125rem]  group-hover:border-white mr-2 ${
                    isSpoilerChecked ? "border-[#2abdbb]" : "border-[#a0a0a0]"
                  }`}
                >
                  <svg viewBox="2 2 16 16" className="fill-none">
                    <path
                      d="M6,10 C7.93333333,12 8.93333333,13 9,13 C9.06666667,13 10.7333333,11 14,7"
                      strokeWidth="2"
                      className={isSpoilerChecked ? "ischecked" : ""}
                    ></path>
                  </svg>
                </div>
                <span>Mark as spoiler</span>
              </label>

              {/* control actions */}

              <div className="flex items-center justify-end space-x-4 w-full">
                {reviewUpdateIsPending ? (
                  <NyanLoader className="h-14" />
                ) : (
                  <>
                    <button
                      className={`bg-transparent hover:bg-transparent text-[#007bff] border-2 border-[#007bff]
              hover:border-[#1385ff] hover:text-[#1385ff] px-3 md:px-5 lg:px-7 py-3 text-[0.9rem] md:text-lg lg:text-xl font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none ${
                isSmallScreen ? "mt-4 w-full" : ""
              }`}
                      onClick={handleCloseAddReviewSection}
                    >
                      Cancel
                    </button>
                    <button
                      className={`bg-[#007bff] hover:bg-[#1385ff] border-2 border-[#1385ff] disabled:bg-[#a0a0a0] disabled:border-[#a0a0a0] text-white px-3 md:px-5 lg:px-7 py-3 text-[0.9rem] md:text-lg lg:text-xl font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none ${
                        isSmallScreen ? "mt-4 w-full" : ""
                      }`}
                      onClick={handleSubmitReview}
                      disabled={!isReviewValid}
                    >
                      Post
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewEditor;
