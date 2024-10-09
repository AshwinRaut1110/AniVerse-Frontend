import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function Options({ TABS, numberOfTabs }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="w-full rounded-xl bg-[#191919] shadow-md min-h-[50rem] mt-20">
      {/* nav div */}
      <div
        className={`grid grid-cols-${numberOfTabs} w-full h-20 bg-transparent border-b-2 border-gray-500`}
      >
        {TABS.map(({ id, title }) => (
          <div
            className="relative flex items-center justify-center text-white text-sm md:text-base lg:text-xl font-bold font-[Lato] bg-transparent cursor-pointer"
            key={id}
            onClick={() => setActiveTab(id)}
          >
            {title}
            {id === activeTab && (
              <motion.div
                className="h-[2px] bg-primary-blue w-full absolute bottom-[-2px]"
                layoutId="underline"
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {TABS.find(({ id }) => id === activeTab).component}
      </AnimatePresence>
    </div>
  );
}

export default Options;
