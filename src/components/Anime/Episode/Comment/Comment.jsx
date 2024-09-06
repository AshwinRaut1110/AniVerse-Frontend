import { useDispatch, useSelector } from "react-redux";
import defaultProfile from "../../../../assets/defaultProfile.jpg";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import { timeAgo } from "../../../../util/misc";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUturnLeftIcon,
  HandThumbDownIcon as HandThumbDownIconOutline,
  HandThumbUpIcon as HandThumbUpIconOutline,
} from "@heroicons/react/24/outline";

import {
  HandThumbDownIcon as HandThumbDownIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
} from "@heroicons/react/24/solid";

import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAComment,
  findUserLike,
  queryClient,
  replyToAComment,
  updateAComment,
} from "../../../../util/http";
import { notificationActions } from "../../../../store/NotificationSlice";
import Replies from "./Replies";
import LikeDislike from "./LikeDislike";

const updateCommentsOnCommentCreated = (episodeId, data) => {
  queryClient.refetchQueries({
    queryKey: ["episodes", episodeId, "comments"],
  });
};

const updateCommentsOnCommentUpdated = ({
  episodeId,
  data,
  commentId,
  pageParam,
  parentId,
}) => {
  const queryKey = parentId
    ? ["episodes", episodeId, "comments", parentId, "replies"]
    : ["episodes", episodeId, "comments"];

  const arrayName = parentId ? "replies" : "comments";

  queryClient.setQueryData(queryKey, function (oldData) {
    const updatedData = JSON.parse(JSON.stringify(oldData));

    const commentIndex = updatedData.pages[pageParam].data[arrayName].findIndex(
      (comment) => comment._id === commentId
    );

    if (commentIndex === -1) return oldData;

    updatedData.pages[pageParam].data[arrayName][commentIndex].comment =
      data.data.comment.comment;

    return updatedData;
  });
};

const updateRepliesOnReplyCreated = ({ episodeId, commentId }) => {
  queryClient.refetchQueries({
    queryKey: ["episodes", episodeId, "comments", commentId, "replies"],
  });
};

// type = create | update | reply

export function CommentInput({
  type,
  episodeId,
  initialValue,
  onCancel,
  commentId,
  pageParam,
  parentId,
}) {
  const [showControls, setShowControls] = useState(false);
  const commentInputRef = useRef(null);
  const dispatch = useDispatch();

  let placeholder, buttonText, mutationFn;

  switch (type) {
    case "create":
      placeholder = "leave a comment.";
      buttonText = "Comment";
      mutationFn = createAComment;
      break;
    case "update":
      placeholder = "update your comment.";
      buttonText = "Update";
      mutationFn = updateAComment;
      break;
    case "reply":
      placeholder = "reply to this comment.";
      buttonText = "Reply";
      mutationFn = replyToAComment;
      break;
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ["episodes", episodeId, "comments", "create"],
    mutationFn,
    onSuccess: function (data) {
      if (type === "create") updateCommentsOnCommentCreated(episodeId, data);
      else if (type === "update") {
        updateCommentsOnCommentUpdated({
          episodeId,
          data,
          commentId,
          pageParam,
          parentId,
        });
        onCancel();
      } else if (type === "reply") {
        updateRepliesOnReplyCreated({
          episodeId,
          data,
          commentId: parentId,
        });
        onCancel();
      }

      commentInputRef.current.value = "";
    },
    onError(error) {
      dispatch(
        notificationActions.showErrorNotification({
          title: "Error",
          message: error.info.message || "Some error occurred.",
        })
      );
    },
  });

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const comment = formData.get("comment");

    const mutatationData = { comment, episodeId };
    if (type === "update") mutatationData["commentId"] = commentId;
    if (type === "reply") mutatationData["parent"] = parentId;

    mutate(mutatationData);

    // clear the input and retract the controls
    setShowControls(false);
    commentInputRef.current.blur();
  };

  const handleShowControls = () => {
    setShowControls(true);
  };

  const handleHideControls = () => {
    setShowControls(false);
  };

  const handleCancelClicked = () => {
    onCancel();
  };

  return (
    <form onSubmit={handleOnSubmit} className={type === "reply" ? `mr-5` : ""}>
      <textarea
        ref={commentInputRef}
        type="text"
        rows={5}
        placeholder={placeholder}
        name="comment"
        id="comment"
        autoComplete="off"
        className="text-xs md:text-sm p-3 w-full rounded-md outlinenone bg-[#232323] text-gray-400 placeholder:text-gray-400 border border-[#333333]"
        onFocus={handleShowControls}
        onBlur={handleHideControls}
        defaultValue={initialValue || ""}
      />
      <AnimatePresence>
        {showControls && !isPending && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "just" }}
            className="w-full flex items-center justify-end py-2 pr-2 space-x-3"
          >
            <button
              type="button"
              className={`bg-transparent hover:bg-transparent text-[#007bff] border-2 border-[#007bff]
              hover:border-[#1385ff] hover:text-[#1385ff] px-3 md:px-5 py-2 text-xs md:text-base font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none`}
              onClick={handleCancelClicked}
            >
              Cancel
            </button>

            <button
              className={`bg-[#007bff] hover:bg-[#1385ff] border-2 border-[#1385ff] disabled:bg-[#a0a0a0] disabled:border-[#a0a0a0] text-white px-3 md:px-5 py-2 text-xs md:text-base font-bold rounded-lg active:scale-95 transition-all ease-in-out outline-none`}
            >
              {buttonText}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Comment({ commentData, pageParam }) {
  const {
    _id: commentId,
    username,
    profilePicture,
    comment,
    createdAt,
    likes,
    dislikes,
    numberOfReplies,
    parent: parentId,
    episode: episodeId,
  } = commentData;

  const [likeData, setLikeData] = useState(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isRepliesSectionOpen, setIsRepliesSectionOpen] = useState(false);

  const currentUser = useSelector((state) => state.auth?.user);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["comments", commentId, "like", commentId, currentUser.username],
    queryFn: ({ signal }) => findUserLike({ signal, commentId, episodeId }),
    retry: false,
    enabled: !!currentUser,
  });

  useEffect(() => {
    if (!isPending && !isError && data) setLikeData(data);
  }, [data]);

  const [showUpdateDiv, setShowUpdateDiv] = useState(false);

  const createdTimeAgo = timeAgo(createdAt);

  const handleLikeDislike = () => {
    queryClient.refetchQueries({
      queryKey: ["episodes", episodeId, "comments"],
    });

    queryClient.refetchQueries({
      queryKey: [
        "comments",
        commentId,
        "like",
        commentId,
        currentUser.username,
      ],
    });
  };

  // const { windowSize } = useWindowDimensions();

  const controlsDivContent = (
    <div className="flex items-center space-x-4 text-white pb-2">
      <button
        className="flex items-center space-x-2 hover:text-primary-blue"
        onClick={() => setShowReplyBox((prevValue) => !prevValue)}
      >
        <ArrowUturnLeftIcon className="h-4" />
        <span>Reply</span>
      </button>

      <LikeDislike
        value={likes}
        commentId={commentId}
        episodeId={episodeId}
        isPending={isPending}
        likeData={likeData}
        onSuccess={handleLikeDislike}
        IconOutline={HandThumbUpIconOutline}
        IconSolid={HandThumbUpIconSolid}
        type="like"
      />

      <LikeDislike
        value={dislikes}
        commentId={commentId}
        episodeId={episodeId}
        isPending={isPending}
        likeData={likeData}
        onSuccess={handleLikeDislike}
        IconOutline={HandThumbDownIconOutline}
        IconSolid={HandThumbDownIconSolid}
        type="dislike"
      />

      {currentUser.username === username && (
        <button
          className="flex items-center space-x-2 hover:text-primary-blue"
          onClick={() => setShowUpdateDiv((prevValue) => !prevValue)}
        >
          <PencilIcon className="h-4" />
          <span>Edit</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="flex space-x-4 w-full  p-2">
      <img
        src={profilePicture || defaultProfile}
        className="h-20 w-20 rounded-full"
        alt="user profile picture"
      />

      <div className="w-full mt-2 space-y-2">
        <div className="w-full">
          <p className="font-[Lato] text-xs sm:text-sm md:text-base space-x-3">
            <span className="text-white font-bold">{username}</span>
            <span className="text-gray-400">{createdTimeAgo}</span>
          </p>
        </div>

        {showUpdateDiv ? (
          <CommentInput
            type="update"
            initialValue={comment}
            onCancel={() => setShowUpdateDiv(false)}
            commentId={commentId}
            episodeId={episodeId}
            pageParam={pageParam}
            parentId={parentId}
          />
        ) : (
          <p className="w-full text-white">{comment}</p>
        )}

        {controlsDivContent}

        {/* reply input */}
        {showReplyBox && (
          <CommentInput
            type="reply"
            onCancel={() => setShowReplyBox(false)}
            episodeId={episodeId}
            parentId={commentId}
            pageParam={pageParam}
          />
        )}

        {/* reply div */}
        <Replies
          commentId={commentId}
          episodeId={episodeId}
          isRepliesSectionOpen={isRepliesSectionOpen}
          setIsRepliesSectionOpen={setIsRepliesSectionOpen}
          numberOfReplies={numberOfReplies}
        />
      </div>
    </div>
  );
}

export default Comment;
