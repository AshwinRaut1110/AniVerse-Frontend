import { PencilIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import defaultProfile from "../assets/defaultProfile.jpg";
import AnimeStats from "../components/Anime/AnimeStats";
import Options from "../components/ProfilePageComponents/Options";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfilePicture } from "../util/http";
import { notificationActions } from "../store/NotificationSlice";
import { authActions } from "../store/authSlice";
import NyanLoader from "../components/UI/NyanLoader";
import ProfileSettings from "../components/ProfilePageComponents/ProfileSettings/ProfileSettings";
import Watchlist from "../components/ProfilePageComponents/Watchlist/Watchlist";

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update profile picture"],
    mutationFn: updateUserProfilePicture,
    onSuccess(data) {
      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: "Profile picture updated successfully.",
        })
      );

      // update the redux auth state
      dispatch(authActions.updateAuthState({ user: data.data.user }));
    },
    onError(error) {
      dispatch(
        notificationActions.showErrorNotification({
          title: "Error",
          message: error?.info?.message || "Something went wrong!",
        })
      );
    },
  });

  const handleProfilePictureChanged = (e) => {
    if (!e.target.files || !e.target.files[0]) return;

    const formData = new FormData();

    formData.set("profile-pic", e.target.files[0]);

    mutate(formData);
  };

  return (
    <div className="w-full h-full px-3 md:px-12 py-14">
      <div className="flex flex-col xl:flex-row space-x-0 xl:space-x-10 space-y-10 xl:space-y-0">
        <div className="flex flex-col w-fit items-center justify-center mx-auto xl:m-0 space-y-2 min-w-48">
          <label
            htmlFor="profile-image"
            className="block w-fit relative cursor-pointer group"
          >
            <img
              src={
                `${user.profilePicture}?${new Date().getTime()}` ||
                defaultProfile
              }
              className="rounded-full h-48 border-2 border-[#767676]"
            />

            <PencilIcon className="hidden group-hover:block h-7 text-black absolute m-auto left-0 right-0 top-0 bottom-0" />

            <input
              type="file"
              className="hidden"
              id="profile-image"
              accept="image/png image/jpeg"
              disabled={isPending}
              onChange={handleProfilePictureChanged}
            />
          </label>

          {isPending ? (
            <NyanLoader className="h-14 pt-4" />
          ) : (
            <h3 className="text-white font-[Lato] font-semibold text-xl">
              {user.username}
            </h3>
          )}
        </div>

        {/* stats div */}
        <AnimeStats />
      </div>

      {/* Profile page options (settings, watchlist) */}
      <Options
        TABS={[
          {
            title: "Profile Settings",
            id: "profilesettings",
            component: <ProfileSettings />,
          },
          {
            title: "Watchlist",
            id: "watchlist",
            component: <Watchlist />,
          },
          {
            title: "History",
            id: "history",
            component: <ProfileSettings />,
          },
        ]}
      />
    </div>
  );
}

export default ProfilePage;
