import { getComments } from "../../../../util/http";
import { useInfiniteQuery } from "@tanstack/react-query";
import Comment, { CommentInput } from "./Comment";
import defaultProfile from "../../../../assets/defaultProfile.jpg";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";

const commentVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function CommentsSection({ activeEpisode }) {
  const { username, profilePicture } = useSelector((state) => state.auth.user);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["episodes", activeEpisode._id, "comments"],
    queryFn: ({ pageParam, signal }) =>
      getComments({
        episodeId: activeEpisode._id,
        sort: "-createdAt",
        pageParam,
        limit: 10,
        signal,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPage.results === 0 ? undefined : lastPageParam + 1;
    },
  });

  if (isPending) return <p className="text-white text-xl">Loading...</p>;

  if (isError)
    return <p className="text-white text-xl">{error.info.message}</p>;

  return (
    <div className="w-full border-2 border-white bg-[#191919] p-7 space-y-3 rounded-md">
      {/* add comment and top bar */}
      <div className="flex space-x-3">
        <img
          src={profilePicture || defaultProfile}
          alt="user's profile picture"
          className="rounded-full w-14 h-14"
        />
        <div className="flex flex-col w-full space-y-3">
          <p className="font-[Lato] text-xs sm:text-sm md:text-base space-x-1 pt-2">
            <span className="text-gray-400 font-bold">Comment as</span>
            <span className="text-white font-bold">{username}</span>
          </p>

          <CommentInput
            type="create"
            episodeId={activeEpisode._id}
            onCancel={() => {}}
          />
        </div>
      </div>

      {/* comments */}

      <AnimatePresence>
        {data?.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.data.comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={commentVariants}
                // transition={{ duration: 0.5 }}
              >
                <Comment
                  key={comment._id}
                  commentData={comment}
                  pageParam={pageIndex}
                />
              </motion.div>
            ))}
          </Fragment>
        ))}
      </AnimatePresence>

      {!isPending && !isFetchingNextPage && !isError && hasNextPage && (
        <div className="flex w-full items-center justify-center pt-5">
          <button
            className="bg-[#007bff] hover:bg-[#1385ff] text-white px-3 md:px-5 lg:px-7 py-3 md:py-4 text-[0.9rem] md:text-base font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none"
            onClick={fetchNextPage}
          >
            LOAD MORE COMMENTS
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentsSection;
