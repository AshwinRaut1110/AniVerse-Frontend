import { motion } from "framer-motion";
import React, { useState } from "react";
import Input from "../../UI/Inputs/Input";
import { useMutation } from "@tanstack/react-query";
import { UpdateUserPassword } from "../../../util/http";
import ErrorComponent from "../../UI/ErrorComponent";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store/NotificationSlice";
import { authActions } from "../../../store/authSlice";
import NyanLoader from "../../UI/NyanLoader";

const initialPasswordState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function UpdatePassword({ showUpdatePasswordDiv, setShowUpdatePasswordDiv }) {
  const [passwordState, setPasswordState] = useState(initialPasswordState);

  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["update password"],
    mutationFn: UpdateUserPassword,
    onSuccess(data) {
      // if the password is updated successfully, then show success message and logout
      dispatch(
        notificationActions.showSuccessNotification({
          title: "Success",
          message: "Password updated successfully.",
        })
      );

      dispatch(authActions.logout());
    },
    onError(error) {
      setError(error?.info?.message || "Something went wrong!");
    },
  });

  const handleUpdatePasswordState = (property, value) => {
    setPasswordState((prevValue) => ({ ...prevValue, [property]: value }));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    const currentPassword = passwordState["currentPassword"].trim();
    const newPassword = passwordState["newPassword"].trim();
    const confirmPassword = passwordState["confirmPassword"].trim();

    if (!currentPassword || !newPassword || !confirmPassword) return;

    mutate({ currentPassword, newPassword, confirmPassword });

    setPasswordState(initialPasswordState);
  };

  return (
    <motion.div
      className="overflow-hidden"
      initial={{ height: "0px" }}
      animate={{
        height: showUpdatePasswordDiv ? "fit-content" : "0px",
      }}
      transition={{ type: "tween" }}
    >
      {isError && error && (
        <ErrorComponent errors={error} onHideError={() => setError(null)} />
      )}
      <form className="space-y-5" onSubmit={handleUpdatePassword}>
        <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordState.currentPassword}
            autoComplete="off"
            required
            onChange={(e) =>
              handleUpdatePasswordState("currentPassword", e.target.value)
            }
          />

          <Input
            label="New Password"
            name="newPassword"
            type="password"
            autoComplete="off"
            value={passwordState.newPassword}
            required
            onChange={(e) =>
              handleUpdatePasswordState("newPassword", e.target.value)
            }
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            autoComplete="off"
            value={passwordState.confirmPassword}
            required
            onChange={(e) =>
              handleUpdatePasswordState("confirmPassword", e.target.value)
            }
          />
        </div>
        <div className="flex items-center space-x-3 md:space-x-5 justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpdatePasswordDiv(false)}
            className="bg-transparent border-2 border-white text-white text-sm md:text-base lg:text-lg px-10 md:px-16 py-4 sm:py-5 rounded-full"
            type="button"
          >
            Close
          </motion.button>
          {isPending ? (
            <NyanLoader className="h-12 md:h-16" />
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-white text-sm md:text-base lg:text-lg px-5 sm:px-10 md:px-16 py-4 sm:py-5 rounded-full"
            >
              Update My Password
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
}

export default UpdatePassword;
