import { PencilIcon } from "@heroicons/react/24/outline";
import Input from "../UI/Inputs/Input";
import { useState } from "react";
import Select from "../UI/Inputs/Select";
import { GENRES } from "../../util/constants";
import DynamicInputList from "../UI/Inputs/DynamicInputList";
import { useMutation } from "@tanstack/react-query";
import { createAnime, queryClient, updateAnime } from "../../util/http";
import ErrorComponent from "../UI/ErrorComponent";
import DateInput from "../UI/Inputs/Date";
import { useParams } from "react-router-dom";
import RelatedAnimesInput from "../UI/Inputs/RelatedAnimesInput";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../store/NotificationSlice";

// default initialState for createNewAnime page
const initialState = {
  names: {
    english: "",
    japanese: "",
  },
  type: "",
  episodes: "",
  status: "",
  premiered: {
    season: "",
    year: "",
  },
  broadcast: "",
  aired: {
    startDate: "",
    endDate: "",
  },
  duration: "",
  genres: [],
  producers: [""],
  studios: [""],
  description: "",
  relatedAnimes: [""],
};

function AnimeCreator({ existingAnimeData }) {
  const { animeId } = useParams();

  // anime data states
  const [animeData, setAnimeData] = useState(existingAnimeData || initialState);
  const [genres, setGenres] = useState(
    existingAnimeData?.genres || initialState.genres
  );
  const [producers, setProducers] = useState(
    existingAnimeData?.producers || initialState.producers || [""]
  );
  const [studios, setStudios] = useState(
    existingAnimeData?.studios || initialState.studios || [""]
  );
  const [description, setDescription] = useState(
    existingAnimeData?.description || initialState.description
  );
  const [relatedAnimes, setRelatedAnimes] = useState(
    existingAnimeData?.relatedAnimes ||
      initialState.relatedAnimes || [{ anime: "", relation: "" }]
  );

  const [showError, setShowError] = useState(false);

  // anime banner states
  const [banner, setBanner] = useState();
  const [bannerPreview, setBannerPreview] = useState("");

  // anime thumbnail states
  const [thumbnail, setThumbnail] = useState();
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // dispatch
  const dispatch = useDispatch();

  // mutation for sending the new anime data to the api
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: animeId ? updateAnime : createAnime,
    onSuccess: function (data) {
      setAnimeData(data.data.anime);

      queryClient.invalidateQueries({
        queryKey: ["animes", data.data.anime._id],
      });

      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: `${data.data.anime.names.english} was ${
            animeId ? "updated" : "added"
          } successfully.`,
        })
      );
    },
    onError: function (error) {
      setShowError(true);
      console.log(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (thumbnail) {
      formData.append("anime-thumbnail", thumbnail);
    }

    if (banner) {
      formData.append("anime-banner", banner);
    }

    const newAnime = {
      ...animeData,
      genres,
      producers,
      studios,
      relatedAnimes,
      description,
    };

    formData.append("animeData", JSON.stringify(newAnime));

    if (animeId) mutate({ formData, animeId });
    else mutate(formData);
  };

  const handleNameChange = (language, value) => {
    setAnimeData((prevValue) => {
      const updatedValues = { ...prevValue };
      updatedValues.names[language] = value;

      return updatedValues;
    });
  };

  const handleInputValueChanged = (field, value) => {
    setAnimeData((prevValue) => ({ ...prevValue, [field]: value }));
  };

  const handleNestedValueChanged = (field, value, parentField) => {
    setAnimeData((prevValue) => ({
      ...prevValue,
      [parentField]: { ...prevValue[parentField], [field]: value },
    }));
  };

  const handleGenreClicked = (clickedGenre) => {
    const genreIndex = genres.findIndex((genre) => genre === clickedGenre);

    setGenres((prevValue) => {
      const updatedGenres = [...prevValue];

      if (genreIndex === -1) {
        updatedGenres.push(clickedGenre);
      } else {
        updatedGenres.splice(genreIndex, 1);
      }

      return updatedGenres;
    });
  };

  const handleThumbnailChanged = (e) => {
    const thumbnailFile = e.target.files[0];

    setThumbnail(thumbnailFile);

    // extract the binary buffer of the file to be displayed for the preview
    const thumbnailPreview = new FileReader();

    thumbnailPreview.onload = function () {
      setThumbnailPreview(thumbnailPreview.result);
    };

    thumbnailPreview.readAsDataURL(thumbnailFile);
  };

  const handleBannerChanged = (e) => {
    const bannerFile = e.target.files[0];

    setBanner(bannerFile);

    // extract the binary buffer of the file to be displayed for the preview
    const bannerPreview = new FileReader();

    bannerPreview.onload = function () {
      setBannerPreview(bannerPreview.result);
    };

    bannerPreview.readAsDataURL(bannerFile);
  };

  const handleHideError = () => {
    setShowError(false);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center pt-20">
      {/* banner container */}
      <label className="relative group cursor-pointer" htmlFor="anime-banner">
        {(bannerPreview || animeData.banner) && (
          <PencilIcon className="hidden absolute text-gray-300 h-10 top-0 right-0 bottom-0 left-0 mt-auto mr-auto mb-auto ml-auto group-hover:block" />
        )}

        {!bannerPreview && !animeData.banner && (
          <div className="flex items-center justify-center w-[95vw] aspect-[1.77/1] border-2 border-white ">
            <p className="text-white font-medium font-[Lato]">
              <span className="text-gray-400">Click to upload or </span>
              <span>Drag and Drop the banner</span>
            </p>
          </div>
        )}

        {(bannerPreview || animeData.banner) && (
          <div className="flex items-center justify-center w-[95vw] [1.77/1] border-2 border-white mx-auto ">
            <img
              src={bannerPreview || animeData.banner}
              alt="banner"
              className="w-full h-full"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/png image/jpeg"
          name="anime-banner"
          id="anime-banner"
          className="hidden"
          onChange={handleBannerChanged}
          loading="lazy"
        />
      </label>

      <div className="flex flex-col items-center justify-center md:items-start md:flex-row pt-20 pb-10">
        {/* thumbnail container */}
        <label
          className="relative group cursor-pointer"
          htmlFor="anime-thumbnail"
        >
          {(thumbnailPreview || animeData.thumbnail) && (
            <PencilIcon className="hidden absolute text-gray-300 h-10 top-0 right-0 bottom-0 left-0 mt-auto mr-auto mb-auto ml-auto group-hover:block" />
          )}

          {!thumbnailPreview && !animeData.thumbnail && (
            <div className="flex items-center justify-center h-[504px] lg:h-[650px] w-[350px] lg:w-[450px] border-2 border-white">
              <p className="text-white font-medium font-[Lato]">
                <span className="text-gray-400">Click to upload or </span>
                <span>Drag and Drop the thumbnail</span>
              </p>
            </div>
          )}

          {(thumbnailPreview || animeData.thumbnail) && (
            <div className="flex items-center justify-center h-[504px] lg:h-[650px] w-[350px] lg:w-[450px] border-2 border-white">
              <img
                src={thumbnailPreview || animeData.thumbnail}
                alt="thumbnail"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/png image/jpeg"
            name="anime-thumbnail"
            id="anime-thumbnail"
            className="hidden"
            onChange={handleThumbnailChanged}
          />
        </label>

        {/* details div */}
        <form onSubmit={handleSubmit} className="p-5 flex-grow space-y-5">
          {/* error modal */}
          {showError && isError && (
            <ErrorComponent
              errors={error.info?.message || error.message}
              onHideError={handleHideError}
            />
          )}

          {/* anime names div */}
          <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-y-4 md:gap-y-0 md:gap-x-4">
            {Object.keys(animeData.names).map((language) => (
              <Input
                name={`${language}`}
                type="text"
                label={`${language} name`}
                value={animeData.names[language]}
                onChange={(e) =>
                  handleNameChange(e.target.name, e.target.value)
                }
                key={language}
              />
            ))}
          </div>

          {/* airing status and episodes div */}
          <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-y-4 md:gap-y-0 md:gap-x-4">
            <Select
              name="type"
              options={{
                Type: "",
                TV: "TV",
                OVA: "OVA",
                ONA: "ONA",
                MOVIE: "MOVIE",
              }}
              value={animeData.type}
              onChange={(e) => {
                console.log(e.target.name, e.target.value);
                handleInputValueChanged(e.target.name, e.target.value);
              }}
            />

            <Input
              name="episodes"
              type="text"
              label="number of episodes"
              value={animeData.episodes}
              onChange={(e) =>
                handleInputValueChanged(e.target.name, e.target.value)
              }
            />

            <Select
              name="status"
              options={{
                Status: "",
                "Not yet aired": "not yet aired",
                Ongoing: "ongoing",
                "Finished airing": "finished airing",
              }}
              value={animeData.status}
              onChange={(e) => {
                handleInputValueChanged(e.target.name, e.target.value);
              }}
            />
          </div>

          {/* release schedule div */}
          <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-y-4 md:gap-y-0 md:gap-x-4">
            <Select
              name="season"
              options={{
                Season: "",
                Fall: "fall",
                Summer: "summer",
                Spring: "spring",
                Winter: "winter",
              }}
              value={animeData.premiered.season}
              onChange={(e) =>
                handleNestedValueChanged(
                  e.target.name,
                  e.target.value,
                  "premiered"
                )
              }
            />

            <Input
              name="year"
              type="text"
              label="Year of release"
              value={animeData.premiered.year}
              onChange={(e) =>
                handleNestedValueChanged(
                  e.target.name,
                  e.target.value,
                  "premiered"
                )
              }
            />

            <Input
              name="broadcast"
              type="text"
              label="Broadcast time"
              value={animeData.broadcast}
              onChange={(e) =>
                handleInputValueChanged(e.target.name, e.target.value)
              }
            />
          </div>

          {/* start and end date div */}
          <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-y-4 md:gap-y-0 md:gap-x-4">
            <DateInput
              name="startDate"
              value={animeData.aired.startDate}
              onChange={(e) =>
                handleNestedValueChanged(e.target.name, e.target.value, "aired")
              }
              title="Airing started on"
            />

            <DateInput
              name="endDate"
              value={animeData.aired.endDate}
              onChange={(e) =>
                handleNestedValueChanged(e.target.name, e.target.value, "aired")
              }
              title="Airing ended on"
            />

            <Input
              name="duration"
              type="text"
              label="Episode duration"
              value={animeData.duration}
              onChange={(e) =>
                handleInputValueChanged(e.target.name, e.target.value)
              }
            />
          </div>

          {/* anime description div */}
          <div className="input-container">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
            />
            <label
              className={description ? "active" : ""}
              htmlFor="description"
            >
              Anime Description
            </label>
          </div>

          {/* genres div */}
          <div className="w-full">
            <h3 className="text-3xl font-bold font-[Lato] text-[#DDDDDD] my-3">
              Genres
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex flex-wrap w-full">
              {GENRES.map((genre) => {
                const isSelected = genres.includes(genre);

                // bg-[#1c1c1c]
                // bg-[#33c533]
                // bg-[#FFA500]

                let className = `text-white px-5 py-3 m-3 border border-[#ddd] outline-none rounded-md active:scale-95 hover:bg-[#ef9b00] ${
                  isSelected ? "bg-[#ef9b00]" : ""
                }`;

                return (
                  <button
                    type="button"
                    value={genre}
                    className={className}
                    key={genre}
                    onClick={(e) => handleGenreClicked(e.target.value)}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* producers and studios div */}
          <div className="flex flex-col md:flex-row">
            <DynamicInputList
              setFunction={setProducers}
              DynamicInputs={producers}
              label="Producer"
            />

            <DynamicInputList
              setFunction={setStudios}
              DynamicInputs={studios}
              label="Studio"
            />
          </div>

          {/* related animes and country of origin div */}

          <RelatedAnimesInput
            setFunction={setRelatedAnimes}
            DynamicInputs={relatedAnimes}
            label="Related anime"
          />

          {/* <div className="px-3 md:px-0">
              <Select
                name="country"
                options={{
                  Country: "",
                  Japan: "JAPAN",
                  China: "CHINA",
                  Korea: "KOREA",
                }}
                className="p-4"
                value={animeData.country}
                onChange={(e) =>
                  handleInputValueChanged(e.target.name, e.target.value)
                }
              />
            </div> */}

          {/* form actions div */}
          <div className="flex justify-end w-full pt-10">
            <button className="bg-[#007bff] hover:bg-[#1385ff] text-white w-full py-6 text-3xl font-bold rounded-full active:scale-95 transition-all ease-in-out outline-none">
              {animeId ? "Update Anime" : "Add Anime"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AnimeCreator;
