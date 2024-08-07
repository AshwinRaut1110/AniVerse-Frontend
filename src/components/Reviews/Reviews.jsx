import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
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
import ErrorComponent from "../UI/ErrorComponent";

function Reviews({ averageRating, ratingsQuantity }) {
  const { animeId } = useParams();

  const {
    data,
    isFetching,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["animes", animeId, "reviews"],
    queryFn: ({ pageParam, signal }) =>
      getAllReviewsForAnAnime(animeId, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.results === 0 ? null : pages.length + 1;
    },
  });

  let content;

  if (isFetching && !isFetchingNextPage && !isError) {
    content = (
      <div
        className="flex flex-col items-center justify-center
w-full md:w-[80%] mx-auto bg-primary-color p-4 font-[Lato]"
      >
        <NyanLoader className="h-16" />
      </div>
    );
  } else if (!isFetching && !data?.pages?.length && !isError) {
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
  } else if (!isError) {
    content = (
      <div className="w-full md:w-[80%] mx-auto bg-primary-color p-4 space-y-3 md:space-y-7">
        {data.pages.map((page, index) => (
          <Fragment key={index}>
            {page.data.reviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </Fragment>
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

      {isError && (
        <div className="w-full md:w-[80%] mx-auto bg-primary-color p-4">
          <ErrorComponent
            errors={error.info?.message || "Some error occured."}
          />
        </div>
      )}

      {content}

      {/* load more button */}
      <div className="flex items-center justify-center w-full md:w-[80%] mx-auto bg-primary-color pt-3">
        {!isError && hasNextPage && !isFetching && !isFetchingNextPage && (
          <button
            className="bg-[#007bff] hover:bg-[#1385ff] text-white px-3 md:px-5 lg:px-7 py-3 md:py-4 text-[0.9rem] md:text-base font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none"
            onClick={fetchNextPage}
          >
            LOAD MORE
          </button>
        )}

        {!isError && isFetching && isFetchingNextPage && (
          <NyanLoader className="h-12" />
        )}

        {!isError && !isFetching && !isFetchingNextPage && !hasNextPage && (
          <p className="text-gray-300 text-sm md:text-base text-center">
            It looks like you have read through all the reviews 🙃
          </p>
        )}
      </div>
    </div>
  );
}

export default Reviews;
