import React, { useState } from "react";
import Input from "../../UI/Inputs/Input";
import DateInput from "../../UI/Inputs/Date";
import TextareaInput from "../../UI/Inputs/TextareaInput";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { addEpisode, queryClient, updateEpisode } from "../../../util/http";
import ErrorComponent from "../../UI/ErrorComponent";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store/NotificationSlice";
import EpisodeVariantUploader from "./EpisodeVariantUploader";
import NyanLoader from "../../UI/NyanLoader";

const initialState = {
  title: {
    english: "",
    japanese: "",
  },
  episodeNumber: "",
  anime: "",
  description: "",
  releasedAt: "",
  createdAt: "",
  thumbnail: "",
  streamLink: "",
  versions: {
    360: false,
    480: false,
    720: false,
  },
};

function EpisodeCreator({ existingEpisodeData }) {
  const { episodeIdentifier, animeId } = useParams();

  const [episodeData, setEpisodeData] = useState(
    existingEpisodeData || initialState
  );

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { mutate, isPending: isAddEpisodePending } = useMutation({
    mutationFn: addEpisode,
    onSuccess(data) {
      setEpisodeData(data.data.createdEpisode);

      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: `Episode added successfully.`,
        })
      );
    },
    onError(error) {
      setError(error);
      setShowError(true);
    },
  });

  // complete this, me from tommorow
  const { mutate: mutateUpdateEpisode, isPending: isUpdateEpisodePending } =
    useMutation({
      mutationFn: updateEpisode,
      onSuccess(data) {
        setEpisodeData(data.data.episode);

        dispatch(
          notificationActions.showSuccessNotification({
            title: "Success",
            message: `Episode updated successfully.`,
          })
        );

        queryClient.invalidateQueries({
          queryKey: ["animes", animeId, "episodes", episodeIdentifier],
        });
      },
      onError(error) {
        setShowError(true);
        setError(error);
      },
    });

  const handleNestedValueChanged = (nestedField, value, parentField) => {
    setEpisodeData((prevEpisodeData) => ({
      ...prevEpisodeData,
      [parentField]: { ...prevEpisodeData[parentField], [nestedField]: value },
    }));
  };

  const handleInputValueChanged = (field, value) => {
    setEpisodeData((prevEpisodeData) => ({
      ...prevEpisodeData,
      [field]: value,
    }));
  };

  const handleAddEpisode = () => {
    const data = {
      ...episodeData,
      anime: animeId,
    };

    delete data.createdAt;
    delete data._id;
    delete data.versions;
    delete data.streamLink;
    delete data.thumbnail;

    mutate(data);
  };

  const handleUpdateEpisode = () => {
    const data = {
      ...episodeData,
    };

    delete data.createdAt;
    delete data.versions;
    delete data.streamLink;
    delete data.thumbnail;

    mutateUpdateEpisode(data);
  };

  return (
    <form
      className="text-white flex flex-col pt-20 space-y-10"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setShowError(false);
        if (episodeIdentifier) handleUpdateEpisode();
        else handleAddEpisode();
      }}
    >
      {showError && (
        <ErrorComponent
          errors={error.info?.message || "Something went wrong!"}
          onHideError={() => setShowError(false)}
        />
      )}

      <div className="grid grid-cols-2 gap-10">
        <Input
          id="english"
          value={episodeData.title.english}
          onChange={(e) =>
            handleNestedValueChanged("english", e.target.value, "title")
          }
          label="english title"
        />
        <Input
          id="japanese"
          value={episodeData.title.japanese}
          onChange={(e) =>
            handleNestedValueChanged("japanese", e.target.value, "title")
          }
          label="japanese title"
        />
      </div>

      <div className="grid grid-cols-3 gap-10">
        <Input id="anime" readOnly value={animeId} label="anime" />
        <DateInput
          id="releasedAt"
          value={episodeData.releasedAt}
          onChange={(e) =>
            handleInputValueChanged("releasedAt", e.target.value)
          }
          title="Episode released on"
        />
        <Input
          id="episode-number"
          value={episodeData.episodeNumber}
          onChange={(e) =>
            handleInputValueChanged("episodeNumber", e.target.value)
          }
          label="episode number"
        />
      </div>

      <div className="grid grid-cols-1">
        <TextareaInput
          id="description"
          value={episodeData.description}
          onChange={(e) =>
            handleInputValueChanged("description", e.target.value)
          }
          label="description"
        />
      </div>

      {/* episode upload section */}
      {episodeIdentifier && (
        <>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-[Lato] font-bold text-[#007bff]">
            Manage Episode Variants
          </h3>

          <div className="grid grid-cols-3 gap-10">
            {/* 360p variant */}
            <EpisodeVariantUploader episodeData={episodeData} version={360} />

            {/* 480p variant */}
            <EpisodeVariantUploader episodeData={episodeData} version={480} />

            {/* 720p variant */}
            <EpisodeVariantUploader episodeData={episodeData} version={720} />
          </div>
        </>
      )}

      <button
        className="self-end bg-[#007bff] hover:bg-[#1385ff] text-white w-full md:w-[50%] py-6 text-3xl font-bold rounded-full active:scale-95 transition-all ease-in-out outline-none disabled:bg-gray-400"
        disabled={isAddEpisodePending || isUpdateEpisodePending}
      >
        {episodeIdentifier ? "Update Episode" : "Add Episode"}
      </button>
    </form>
  );
}

export default EpisodeCreator;
