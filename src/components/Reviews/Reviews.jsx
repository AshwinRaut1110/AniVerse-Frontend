import { useQuery } from "@tanstack/react-query";
import ReviewEditor from "./ReviewEditor";
import { useEffect, useState } from "react";
import { REVIEWPAGELIMIT, getAllReviewsForAnAnime } from "../../util/http";
import NyanLoader from "../UI/NyanLoader";
import { useParams } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import { StarIcon } from "@heroicons/react/24/solid";
import Dropdown from "../UI/Dropdown/DropdownSelect";
import {
  AdjustmentsHorizontalIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";

function Reviews({ averageRating, ratingsQuantity }) {
  const { animeId } = useParams();

  const [reviews, setReviews] = useState([]);

  const [reviewPageNumber, setPageNumber] = useState(1);

  const [showMoreReviewsButton, setShowMoreReviewsButton] = useState(true);

  const {
    data: fetchedReviews,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["animes", animeId, "reviews", reviewPageNumber],
    queryFn: ({ signal }) =>
      getAllReviewsForAnAnime(animeId, reviewPageNumber, signal),
  });

  // cleanup function to prevent duplicate reviews when switching from another page back to this page
  useEffect(() => {
    return () => {
      setReviews([]);
      setPageNumber(1);
    };
  }, []);

  useEffect(() => {
    if (
      !fetchedReviews ||
      !fetchedReviews?.data ||
      !fetchedReviews?.data?.reviews
    )
      return;

    if (
      fetchedReviews.data.reviews.length < REVIEWPAGELIMIT ||
      fetchedReviews.data.reviews.length === 0
    ) {
      setShowMoreReviewsButton(false);
    }

    setReviews((prevValue) => [...prevValue, ...fetchedReviews.data.reviews]);
  }, [fetchedReviews]);

  let content;

  if (reviews.length === 0 && isPending) {
    content = (
      <div
        className="flex flex-col items-center justify-center
w-full md:w-[80%] mx-auto bg-primary-color p-4 font-[Lato]"
      >
        <NyanLoader className="h-16" />
      </div>
    );
  } else if (
    reviews.length === 0 &&
    !isPending &&
    fetchedReviews?.data?.reviews?.length === 0
  ) {
    content = (
      <div
        className="flex flex-col items-center justify-center
 w-full md:w-[80%] mx-auto bg-primary-color p-4 font-[Lato]"
      >
        <p className="text-[7rem]">🙁</p>
        <div>
          <p className="text-sm md:text-lg text-white text-center">
            Looks like this anime is flying under the radar! Be the first one to
            share your thoughts on it. 😃
          </p>
          <p className="text-gray-300"></p>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="w-full md:w-[80%] mx-auto bg-primary-color p-4 space-y-3 md:space-y-7">
        {reviews.map((review) => (
          <ReviewItem key={review._id} review={review} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5 w-full px-3 sm:px-7 md:px-14 py-7">
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-[Lato] font-bold text-[#007bff]">
        Reviews
      </h3>

      {/* review filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full md:w-[90%] mx-auto bg-primary-color p-4 space-y-3 md:space-y-0">
        <h4 className="flex items-center text-white text-xl font-[Lato] font-semibold space-x-2">
          <span>{ratingsQuantity} Reviews</span>
          <div className="h-6 w-[1.7px] bg-gray-500" />
          <span>{Number(averageRating).toFixed(1)}</span>
          <StarIcon className="h-6 text-[#ffbc0b]" />
        </h4>

        <div className="flex items-center">
          <Dropdown
            options={["Newest", "Oldest", "Most Helpful"]}
            defaultIndex={2}
            DropdownIcon={Bars3BottomLeftIcon}
          />

          <Dropdown
            options={["All", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star"]}
            title="Filter"
            DropdownIcon={AdjustmentsHorizontalIcon}
            useTitle
          />
        </div>
      </div>

      {/* review editor */}
      <ReviewEditor />

      {content}
    </div>
  );
}

export default Reviews;
