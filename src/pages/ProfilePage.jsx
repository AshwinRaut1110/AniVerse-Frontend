import { PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-20 py-20">
      {/* <h1 className="text-white text-5xl font-bold"></h1> */}

      <label id="profile-image" className="cursor-pointer relative group">
        <PencilIcon className="hidden group-hover:block absolute w-12 text-gray-300 ml-auto mr-auto mt-auto mb-auto left-0 right-0 top-0 bottom-0" />
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt="your profile picture"
            className="border-4 border-white rounded-full h-64"
          />
        )}
        {!user.profilePicture && (
          <UserIcon className="h-56 text-white border-4 border-white rounded-full p-5" />
        )}
        <input
          type="file"
          id="profile-image"
          accept="image/png image/jpeg"
          className="hidden"
        />
      </label>
      <div className="flex-grow p-5 space-y-3">
        <h3 className="text-white text-2xl font-bold text-center">
          {user.username}
        </h3>
        <h3 className="text-white text-2xl font-bold text-center">
          {user.email}
        </h3>
      </div>
    </div>
  );
}

export default ProfilePage;
