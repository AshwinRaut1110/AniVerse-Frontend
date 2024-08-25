import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  deleteEpisodeVariant,
  queryClient,
  uploadEpisodeVariant,
} from "../../../util/http";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store/NotificationSlice";
import { useParams } from "react-router-dom";

function EpisodeVariantUploader({ episodeData, version }) {
  const [inputFile, setInputFile] = useState(null);

  const { episodeIdentifier, animeId } = useParams();

  const [versionExists, setVersionExists] = useState(
    episodeData.versions[version]
  );

  const dispatch = useDispatch();

  const handleOnInputFileChanged = (e) => {
    if (!e.target.files.length) return setInputFile(null);

    setInputFile(e.target.files[0]);
  };

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: uploadEpisodeVariant,
    onSuccess: (data) => {
      console.log(data);

      dispatch(
        notificationActions.showSuccessNotification({
          title: "success",
          message: `${version}p variant was successfully ${
            episodeData.versions[version] ? "updated" : "added"
          }.`,
        })
      );

      queryClient.invalidateQueries({
        queryKey: ["animes", animeId, "episodes", episodeIdentifier],
      });

      setInputFile(null);

      setVersionExists(true);
    },
    onError: (error) => {
      dispatch(
        notificationActions.showErrorNotification({
          title: "success",
          message: `Unable to upload the ${version}p variant.`,
        })
      );
    },
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteEpisodeVariant,
    onSuccess(data) {
      dispatch(
        notificationActions.showSuccessNotification({
          title: "success",
          message: `${version}p variant was successfully deleted.`,
        })
      );

      queryClient.invalidateQueries({
        queryKey: ["animes", animeId, "episodes", episodeIdentifier],
      });

      setVersionExists(false);
    },
    onError(error) {
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

    mutate({
      episodeIdentifier,
      animeId,
      variantData: formData,
      variant: version,
    });
  };

  const handleDeleteVariant = () => {
    mutateDelete({ episodeIdentifier, animeId, variant: version });
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
          inputFile
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

      {versionExists && (
        <button
          type="button"
          className={`bg-[#FF0000] hover:bg-[#DD0000]
        text-white w-full py-6 text-3xl font-bold rounded-full active:scale-95 transition-all ease-in-out outline-none text-center cursor-pointer`}
          onClick={handleDeleteVariant}
        >
          Delete {version}p Variant
        </button>
      )}
    </div>
  );
}

export default EpisodeVariantUploader;
