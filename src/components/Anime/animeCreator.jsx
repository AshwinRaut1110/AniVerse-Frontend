import { PencilIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Input from "../UI/Input";
import { useState } from "react";
import Select from "../UI/Select";
import Date from "../UI/Date";
import { GENRES } from "../../util/constants";
import DynamicInputList from "../UI/DynamicInputList";
import { useMutation } from "@tanstack/react-query";

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

function animeCreator() {
  // States
  const [animeData, setAnimeData] = useState(initialState);
  const [genres, setGenres] = useState(initialState.genres);
  const [producers, setProducers] = useState(initialState.producers || [""]);
  const [studios, setStudios] = useState(initialState.studios || [""]);
  const [description, setDescription] = useState(initialState.description);
  const [relatedAnimes, setRelatedAnimes] = useState(
    initialState.relatedAnimes || [""]
  );

  const [banner, setBanner] = useState();
  const [bannerPreview, setBannerPreview] = useState("");

  const [thumbnail, setThumbnail] = useState();
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // mutation for sending the new anime data to the api
  const { mutate, isPending, isError, error } = useMutation({});

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

    formData("animeData", JSON.stringify(newAnime));
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

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      {/* banner container */}
      <label className="relative group cursor-pointer" htmlFor="anime-banner">
        {bannerPreview && (
          <PencilIcon className="hidden absolute text-gray-300 h-10 top-0 right-0 bottom-0 left-0 mt-auto mr-auto mb-auto ml-auto group-hover:block" />
        )}

        {!bannerPreview && (
          <div className="flex items-center justify-center h-[225px] sm:h-[300px] md:h-[400px] lg:h-[700px] w-[398px] sm:w-[531px] md:w-[708px] lg:w-[1250px] border-2 border-white">
            <p className="text-white font-medium font-[Lato]">
              <span className="text-gray-400">Click to upload or </span>
              <span>Drag and Drop the banner</span>
            </p>
          </div>
        )}

        {bannerPreview && (
          <div className="flex items-center justify-center h-[235px] sm:h-[300px] md:h-[400px] lg:h-[700px] w-[415px] sm:w-[531px] md:w-[708px] lg:w-[1250px] border-2 border-white">
            <img src={bannerPreview} alt="banner" className="w-full h-full" />
          </div>
        )}

        <input
          type="file"
          accept="image/png image/jpeg"
          name="anime-banner"
          id="anime-banner"
          className="hidden"
          onChange={handleBannerChanged}
        />
      </label>

      <div className="flex flex-col items-center justify-center md:items-start md:flex-row pt-20 pb-10">
        {/* thumbnail container */}
        <label
          className="relative group cursor-pointer"
          htmlFor="anime-thumbnail"
        >
          {thumbnailPreview && (
            <PencilIcon className="hidden absolute text-gray-300 h-10 top-0 right-0 bottom-0 left-0 mt-auto mr-auto mb-auto ml-auto group-hover:block" />
          )}
          {/* {!thumbnailPreview && (
          <div className="flex items-center justify-center h-[504px] md:h-[650px] w-[350px] md:w-[450px] border-2 border-white">
            <PhotoIcon className="text-white h-8" />
          </div>
        )} */}

          {!thumbnailPreview && (
            <div className="flex items-center justify-center h-[504px] md:h-[650px] w-[350px] md:w-[450px] border-2 border-white">
              <p className="text-white font-medium font-[Lato]">
                <span className="text-gray-400">Click to upload or </span>
                <span>Drag and Drop the thumbnail</span>
              </p>
            </div>
          )}

          {thumbnailPreview && (
            <div className="flex items-center justify-center h-[504px] md:h-[650px] w-[350px] md:w-[450px] border-2 border-white">
              <img
                src={thumbnailPreview}
                alt="thumbnail"
                className="w-full h-full"
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
            <Date
              name="startDate"
              value={animeData.aired.startDate}
              onChange={(e) =>
                handleNestedValueChanged(e.target.name, e.target.value, "aired")
              }
              title="Airing started on"
            />

            <Date
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

          <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-y-4 md:gap-y-0 md:gap-x-4 items-start md:items-center">
            <DynamicInputList
              setFunction={setRelatedAnimes}
              DynamicInputs={relatedAnimes}
              label="Related anime"
            />

            <div className="px-3 md:px-0">
              <Select
                name="season"
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
            </div>
          </div>

          {/* form actions div */}
          <div className="flex justify-end w-full pt-10">
            <button className="bg-[#007bff] hover:bg-[#1385ff] text-white w-full py-6 text-3xl font-bold rounded-full active:scale-95 transition-all ease-in-out outline-none">
              Add Anime
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default animeCreator;
