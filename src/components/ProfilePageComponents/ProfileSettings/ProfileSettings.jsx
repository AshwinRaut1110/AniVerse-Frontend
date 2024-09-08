import React from "react";
import { motion } from "framer-motion";
import EditProfile from "./EditProfile";

function ProfileSettings() {
  return (
    <motion.div
      className="w-full mt-2 p-5"
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      transition={{ type: "tween" }}
    >
      <EditProfile />
    </motion.div>
  );
}

export default ProfileSettings;
