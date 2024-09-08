import React, { useEffect, useState } from "react";
import Input from "../../UI/Inputs/Input";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import UpdatePassword from "./UpdatePassword";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../../util/http";
import ErrorComponent from "../../UI/ErrorComponent";
import { authActions } from "../../../store/authSlice";
import { notificationActions } from "../../../store/NotificationSlice";
import NyanLoader from "../../UI/NyanLoader";

function EditProfile() {
  const { email: userEmail, username: userUsername } = useSelector(
    (state) => state.auth.user
  );

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showUpdatePasswordDiv, setShowUpdatePasswordDiv] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: "update profile",
    mutationFn: updateUserProfile,
    onSuccess(data) {
      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: "Profile updated successfully.",
        })
      );
      dispatch(authActions.updateAuthState({ user: data.data.user })); // update the redux state
    },
    onError(error) {
      setError(error?.info?.message || "Something went wrong!");
    },
  });

  useEffect(() => {
    setEmail(userEmail);
  }, [userEmail]);

  useEffect(() => {
    setUsername(userUsername);
  }, [userUsername]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    const userData = {};
    const newEmail = email.trim();
    const newUsername = username.trim();

    if (!newEmail || !newUsername) return;

    if (newEmail !== userEmail) userData.email = newEmail;
    if (newUsername !== userUsername) userData.username = newUsername;

    if (!Object.keys(userData).length) return;

    mutate(userData);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-[Lato]">
        Edit Profile
      </h3>
      {error && isError && (
        <ErrorComponent errors={error} onHideError={() => setError(null)} />
      )}
      <form className="space-y-5" onSubmit={handleUpdateProfile}>
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3 md:space-x-5 justify-end">
          {!showUpdatePasswordDiv && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpdatePasswordDiv(true)}
              className="bg-white text-sm md:text-base lg:text-lg px-5 sm:px-10 md:px-16 py-4 sm:py-5 rounded-full"
              type="button"
            >
              Update My Password
            </motion.button>
          )}
          {isPending ? (
            <NyanLoader className="h-12 md:h-16" />
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-white text-sm md:text-base lg:text-lg px-5 sm:px-10 md:px-16 py-4 sm:py-5 rounded-full"
            >
              Update My Profile
            </motion.button>
          )}
        </div>
      </form>

      <UpdatePassword
        showUpdatePasswordDiv={showUpdatePasswordDiv}
        setShowUpdatePasswordDiv={setShowUpdatePasswordDiv}
      />
    </div>
  );
}

export default EditProfile;
