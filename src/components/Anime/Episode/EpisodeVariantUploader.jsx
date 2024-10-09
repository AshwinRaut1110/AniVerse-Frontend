import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  deleteEpisodeVariant,
  queryClient,
  uploadEpisodeVariant,
} from "../../../util/http";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store/NotificationSlice";

function EpisodeVariantUploader({ episodeData, version, setEpisodeData }) {
  const [inputFile, setInputFile] = useState(null);

  const dispatch = useDispatch();

  const handleOnInputFileChanged = (e) => {
    if (!e.target.files.length) return setInputFile(null);

    setInputFile(e.target.files[0]);
  };

  // episode upload / update mutation
  const { mutate: mutateUpload, isPending: isUploadPending } = useMutation({
    mutationFn: uploadEpisodeVariant,
    onSuccess: (data) => {
      const episode = data.data.episode;
      setEpisodeData(data.data.episode);

      dispatch(
        notificationActions.showSuccessNotification({
          title: "success",
          message: `${version}p variant was successfully ${
            episodeData.versions[version] ? "updated" : "added"
          }.`,
        })
      );

      queryClient.invalidateQueries({
        queryKey: [
          "animes",
          episode.anime,
          "episodes",
          String(episode.episodeNumber),
        ],
      });

      setInputFile(null);
    },
    onError() {
      dispatch(
        notificationActions.showErrorNotification({
          title: "success",
          message: `Unable to upload the ${version}p variant.`,
        })
      );
    },
  });

  // episode delete mutation
  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
    mutationFn: deleteEpisodeVariant,
    onSuccess() {
      setEpisodeData((prevValue) => {
        const updatedData = { ...prevValue };
        updatedData.versions[version] = false;
        return updatedData;
      });

      dispatch(
        notificationActions.showSuccessNotification({
          title: "success",
          message: `${version}p variant was successfully deleted.`,
        })
      );

      queryClient.invalidateQueries({
        queryKey: [
          "animes",
          episodeData.anime,
          "episodes",
          episodeData.episodeNumber,
        ],
      });

      setInputFile(null);
    },
    onError() {
      dispatch(
        notificationActions.showErrorNotification({
          title: "success",
          message: `Unable to delete the ${version}p variant.`,
        })
      );
    },
  });

  const handleUploadVariant = () => {
    const formData = new FormData();

    formData.set("episodeVideo", inputFile);

    mutateUpload({
      episodeIdentifier: episodeData.episodeNumber,
      animeId: episodeData.anime,
      variantData: formData,
      variant: version,
    });
  };

  const handleDeleteVariant = () => {
    mutateDelete({
      episodeIdentifier: episodeData.episodeNumber,
      animeId: episodeData.anime,
      variant: version,
    });
  };

  let btnText = `Add ${version}p Variant`;

  if (inputFile) btnText = "Upload Variant";
  else if (episodeData.versions[version])
    btnText = `Update ${version}p Variant`;

  return (
    <div className="flex flex-col space-y-10 w-full">
      <label
        htmlFor={version}
        className={`${
          isUploadPending
            ? "bg-gray-400"
            : inputFile
            ? " bg-orange-500 hover:bg-orange-600"
            : "bg-[#007bff] hover:bg-[#1385ff]"
        } text-white w-full py-6 text-3xl font-bold rounded-full active:scale-95 transition-all ease-in-out outline-none text-center cursor-pointer`}
        onClick={inputFile ? handleUploadVariant : () => {}}
      >
        {btnText}
      </label>
      <input
        type="file"
        name={version}
        id={version}
        accept="video/mp4"
        className="hidden"
        disabled={!!inputFile}
        onChange={handleOnInputFileChanged}
      />

      {episodeData.versions[version] && (
        <button
          type="button"
          className={`bg-[#FF0000] hover:bg-[#DD0000]
        text-white w-full py-6 text-3xl font-bold rounded-full active:scale-95 transition-all ease-in-out outline-none text-center cursor-pointer disabled:bg-gray-400`}
          onClick={handleDeleteVariant}
          disabled={isDeletePending}
        >
          Delete {version}p Variant
        </button>
      )}
    </div>
  );
}

export default EpisodeVariantUploader;
