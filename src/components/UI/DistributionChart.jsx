import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

function DistributionChart({ className, data }) {
  const [width, setWidth] = useState(0);
  const chartRef = useRef(null);

  const totalValue = useMemo(() => {
    return data.reduce((prevSum, { value }) => prevSum + value, 0);
  }, [data]);

  useEffect(() => {
    setWidth(chartRef.current.offsetWidth);
  }, []);

  return (
    <div className={className + " flex"} ref={chartRef}>
      {width &&
        data.map(({ title, value, color }, index) => {
          const sectionWidth = (value / totalValue) * width;

          return (
            <motion.div
              animate={{
                width: [0, sectionWidth],
                transition: { duration: 0.4 },
              }}
              style={{ backgroundColor: color, width: sectionWidth + "px" }}
              className={
                index === 0
                  ? "rounded-bl-md rounded-tl-md"
                  : index === data.length - 1
                  ? " rounded-br-md rounded-tr-md"
                  : ""
              }
              key={title}
              title={`${title} (${value})`}
            />
          );
        })}
    </div>
  );
}

export default DistributionChart;
