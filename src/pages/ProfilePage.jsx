import { PencilIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import defaultProfile from "../assets/defaultProfile.jpg";
import AnimeStats from "../components/Anime/AnimeStats";

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full h-full px-12 py-14">
      <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-10 space-y-10 sm:space-y-0">
        <div className="w-fit flex flex-col items-center justify-center space-y-2 min-w-48 mx-auto sm:mx-0">
          <label
            htmlFor="profile-image"
            className="block w-fit relative cursor-pointer group"
          >
            <img
              src={user.profilePicture || defaultProfile}
              className="rounded-full h-48 border-2 border-[#767676]"
            />

            <PencilIcon className="hidden group-hover:block h-7 text-black absolute m-auto left-0 right-0 top-0 bottom-0" />

            <input
              type="file"
              className="hidden"
              id="profile-image"
              accept="image/png image/jpeg"
            />
          </label>

          <h3 className="text-white font-[Lato] font-semibold text-xl">
            {user.username}
          </h3>
        </div>

        {/* stats div */}
        <AnimeStats />
      </div>
    </div>
  );
}

export default ProfilePage;
