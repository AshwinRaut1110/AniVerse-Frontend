import { motion } from "framer-motion";
import React from "react";

function Watchlist() {
  return (
    <motion.div
      className="w-full border border-green-400 mt-2 h-[40rem] text-white text-xl"
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      transition={{ type: "tween" }}
    >
      Watchlist
    </motion.div>
  );
}

export default Watchlist;
