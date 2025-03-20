import * as React from "react";
import { motion } from "framer-motion";

export const IconPowerUpArrow = ({ isHover = false }) => {
  const draw = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay: 0.5, duration: 1 },
      },
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    },
  };
  const unDraw = {
    hidden: {
      opacity: 1,
    },
    visible: {
      opacity: 0,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay: 1.5, duration: 0.5 },
      },
    },
  };

  return (
    <motion.div style={{ width: "100%", height: "100%" }}>
      <motion.svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 154.73 157.24"
        style={{
          strokeWidth: 4.23,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      >
        <motion.g
          stroke="#0061aa"
          animate={isHover ? "visible" : "hidden"}
          initial="hidden"
        >
          <motion.line
            variants={unDraw}
            x1="122.52"
            y1="126.64"
            x2="122.52"
            y2="99.15"
          />
          <motion.polyline
            variants={unDraw}
            points="35.5,62.96 35.21,24.77 26.8,24.66 47.72,2.06 68.48,25.06 59.8,25.06 59.72,45.24 "
          />
          <motion.polyline
            variants={unDraw}
            points="10.76,153.8 10.47,87.26 2.06,87.15 22.98,64.55 43.74,87.55 35.06,87.55 34.99,155.18 "
          />
          <motion.polyline
            variants={unDraw}
            points="119.68,71.35 119.39,55.01 110.99,54.9 131.91,32.29 152.66,55.29 143.98,55.29 143.91,109.61 "
          />
          <motion.polygon
            variants={unDraw}
            points="49.98,104.37 95.19,39.55 88.6,84.16 115.94,84.04 70.76,149.19 78.04,104.51 "
          />
        </motion.g>
        <motion.g
          animate={isHover ? "visible" : "hidden"}
          stroke="#e37021"
          initial="hidden"
        >
          <motion.line
            variants={draw}
            x1="122.52"
            y1="126.64"
            x2="122.52"
            y2="99.15"
          />
          <motion.polyline
            variants={draw}
            points="35.5,62.96 35.21,24.77 26.8,24.66 47.72,2.06 68.48,25.06 59.8,25.06 59.72,45.24 "
          />
          <motion.polyline
            variants={draw}
            points="10.76,153.8 10.47,87.26 2.06,87.15 22.98,64.55 43.74,87.55 35.06,87.55 34.99,155.18 "
          />
          <motion.polyline
            variants={draw}
            points="119.68,71.35 119.39,55.01 110.99,54.9 131.91,32.29 152.66,55.29 143.98,55.29 143.91,109.61 "
          />
          <motion.polygon
            variants={draw}
            points="49.98,104.37 95.19,39.55 88.6,84.16 115.94,84.04 70.76,149.19 78.04,104.51 "
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
