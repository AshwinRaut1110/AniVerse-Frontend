import React, { Fragment, useEffect } from "react";
import Comment from "./Comment";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getReplies, queryClient } from "../../../../util/http";
import { AnimatePresence, motion } from "framer-motion";

const commentVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function Replies({
  commentId,
  episodeId,
  isRepliesSectionOpen,
  setIsRepliesSectionOpen,
  numberOfReplies,
}) {
  // get the replies
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["episodes", episodeId, "comments", commentId, "replies"],
    queryFn: ({ pageParam, signal }) =>
      getReplies({
        commentId,
        episodeId,
        sort: "-createdAt",
        pageParam,
        limit: import.meta.env.VITE_COMMENT_REPLIES_LIMIT,
        signal,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (numberOfReplies <= import.meta.env.VITE_COMMENT_REPLIES_LIMIT)
        return undefined;

      return lastPageParam * import.meta.env.VITE_COMMENT_REPLIES_LIMIT <
        numberOfReplies
        ? lastPageParam + 1
        : undefined;
    },
    enabled: isRepliesSectionOpen,
  });

  return (
    <div className="w-full">
      {numberOfReplies > 0 && (
        <button
          className="flex items-center space-x-2 bg-transparent text-white text-[0.9rem] md:text-sm font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none"
          onClick={() => setIsRepliesSectionOpen((prevValue) => !prevValue)}
        >
          <motion.span
            className="text-xs"
            animate={{ rotate: isRepliesSectionOpen ? 180 : 0 }}
          >
            &#9660;
          </motion.span>
          <span>
            {isRepliesSectionOpen ? "Hide" : "View"} {numberOfReplies} replies
          </span>
        </button>
      )}

      {isRepliesSectionOpen && data && (
        <AnimatePresence>
          {data?.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.data.replies.map((reply) => (
                <motion.div
                  key={reply._id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={commentVariants}
                  // transition={{ duration: 0.5 }}
                >
                  <Comment
                    key={reply._id}
                    commentData={reply}
                    pageParam={pageIndex}
                  />
                </motion.div>
              ))}
            </Fragment>
          ))}
        </AnimatePresence>
      )}

      {isRepliesSectionOpen && hasNextPage && !isFetchingNextPage && (
        <button
          className="bg-[#007bff] hover:bg-[#1385ff] px-4 py-2 rounded-md text-white text-xs font-bold active:scale-95 transition-all ease-in-out outline-none mt-2"
          onClick={fetchNextPage}
        >
          LOAD MORE REPLIES
        </button>
      )}
    </div>
  );
}

export default Replies;
