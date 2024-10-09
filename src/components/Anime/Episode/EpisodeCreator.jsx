import React, { useState } from "react";
import Input from "../../UI/Inputs/Input";
import DateInput from "../../UI/Inputs/Date";
import TextareaInput from "../../UI/Inputs/TextareaInput";
import { useMutation } from "@tanstack/react-query";
import { addEpisode, queryClient, updateEpisode } from "../../../util/http";
import ErrorComponent from "../../UI/ErrorComponent";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store/NotificationSlice";
import EpisodeVariantUploader from "./EpisodeVariantUploader";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

function EpisodeCreator({
  episodeData,
  mode,
  setEpisodeData,
  onEpisodeDataReset,
}) {
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: mode === "update" ? updateEpisode : addEpisode,
    onSuccess(data) {
      const episode =
        mode === "add" ? data.data.createdEpisode : data.data.episode;
      setEpisodeData(episode);

      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: `Episode ${
            mode === "update" ? "updated" : "added"
          } successfully.`,
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
    },
    onError(error) {
      setError(error);
      setShowError(true);
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

  const handleMutateEpisode = () => {
    const data = {
      ...episodeData,
    };

    delete data.createdAt;
    delete data.versions;
    delete data.streamLink;
    delete data.thumbnail;

    if (mode === "add") delete data._id;
    console.log(data);

    mutate(data);
  };

  return (
    <form
      className="text-white flex flex-col pt-20 space-y-10"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setShowError(false);
        handleMutateEpisode();
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
        <Input id="anime" readOnly value={episodeData.anime} label="anime" />
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
      {mode === "update" && (
        <>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-[Lato] font-bold text-[#007bff]">
            Manage Episode Variants
          </h3>

          <div className="grid grid-cols-3 gap-10">
            {/* 360p variant */}
            <EpisodeVariantUploader
              episodeData={episodeData}
              version={360}
              setEpisodeData={setEpisodeData}
            />

            {/* 480p variant */}
            <EpisodeVariantUploader
              episodeData={episodeData}
              version={480}
              setEpisodeData={setEpisodeData}
            />

            {/* 720p variant */}
            <EpisodeVariantUploader
              episodeData={episodeData}
              version={720}
              setEpisodeData={setEpisodeData}
            />
          </div>
        </>
      )}

      <div className="flex justify-between">
        <button
          className="flex items-center justify-center rounded-full bg-[#ff6b6b] hover:bg-[#ff5252] h-20 w-20 active:scale-95 transition-all ease-in-out outline-none"
          onClick={onEpisodeDataReset}
          type="button"
        >
          <ArrowPathIcon className="text-white h-14" />
        </button>

        <button
          className="bg-[#007bff] hover:bg-[#1385ff] text-white w-full md:w-[50%] py-6 text-3xl font-bold rounded-full active:scale-95 transition-all ease-in-out outline-none disabled:bg-gray-400"
          disabled={isPending}
          type="submit"
        >
          {mode === "update" ? "Update Episode" : "Add Episode"}
        </button>
      </div>
    </form>
  );
}

export default EpisodeCreator;
