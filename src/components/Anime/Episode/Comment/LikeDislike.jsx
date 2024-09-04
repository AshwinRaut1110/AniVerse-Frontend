import { HandThumbUpIcon as HandThumbUpIconOutline } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpIconSolid } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  dislikeAComment,
  likeAComment,
  queryClient,
} from "../../../../util/http";

// queryClient.setQueryData(
//   ["episodes", episodeId, "comments"],
//   function (oldData) {
//     const updatedData = {
//       pages: oldData.pages.map((page) => ({
//         status: page.status,
//         results: page.results,
//         data: { comments: [...page.data.comments] },
//       })),
//       pageParams: [...oldData.pageParams],
//     };

//     const updatedCommentIndex = updatedData.pages[pageParam].data.comments.find(
//       (comment) => comment._id === commentId
//     );

//     if (updatedCommentIndex)
//       updatedData.pages[pageParam].data.comments[updatedCommentIndex].likes++;

//     console.log(updatedData);

//     return updatedData;
//   }
// );

function LikeDislike({
  value,
  commentId,
  episodeId,
  isPending,
  likeData,
  onSuccess,
  IconSolid,
  IconOutline,
  type,
}) {
  const { mutate } = useMutation({
    mutationKey: ["comment", commentId, "like"],
    mutationFn: type === "like" ? likeAComment : dislikeAComment,
    onSuccess(data) {
      onSuccess(data.data.isNew, data);
    },
    onError() {},
  });

  const handleLike = () => {
    mutate({ commentId, episodeId });
  };

  return (
    <button
      className="flex items-center space-x-2 hover:text-primary-blue"
      onClick={handleLike}
      disabled={isPending}
    >
      {!likeData && <IconOutline className={`h-5`} />}
      {type === "like" && likeData && likeData.data.commentLike.like && (
        <IconSolid className={`h-5 text-primary-blue`} />
      )}
      {type === "like" && likeData && !likeData.data.commentLike.like && (
        <IconOutline className={`h-5`} />
      )}
      {type === "dislike" && likeData && !likeData.data.commentLike.like && (
        <IconSolid className={`h-5 text-red-600`} />
      )}
      {type === "dislike" && likeData && likeData.data.commentLike.like && (
        <IconOutline className={`h-5`} />
      )}
      <span>{value}</span>
    </button>
  );
}

export default LikeDislike;
