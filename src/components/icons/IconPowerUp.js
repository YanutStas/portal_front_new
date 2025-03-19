import * as React from "react";
import { motion } from "framer-motion";

export const IconPowerUp = ({ isHover = false }) => {
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
        viewBox="-2 -2 158 138"
        style={{
          strokeWidth: 5.23,
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
          <motion.path
            variants={unDraw}
            d="M1.97 75.7c0,-25.41 12.84,-47.82 32.38,-61.1m6.36 -3.87c9.4,-5.09 20.03,-8.19 31.32,-8.76m7.44 -0c11.58,0.57 22.46,3.81 32.04,9.11m-9.54 15.3c-6.79,-3.61 -14.41,-5.86 -22.5,-6.39m-7.44 0.01c-7.87,0.52 -15.3,2.68 -21.94,6.13m-6.36 3.86c-14.38,10.1 -23.77,26.81 -23.77,45.71 0,30.84 25,55.84 55.84,55.84 26.32,0 48.39,-18.22 54.29,-42.73"
          />
          <motion.path
            variants={unDraw}
            d="M117.84 15.01c10.05,6.97 18.28,16.37 23.85,27.36l10.02 -7.23 0.63 42.11 -37.07 -17.29 11.24 -7.65c-4.08,-8.82 -10.39,-16.4 -18.21,-22.01"
          />
          <motion.circle variants={unDraw} cx="75.8" cy="75.7" r="10.86" />
          <motion.line
            variants={unDraw}
            x1="60.02"
            y1="88.15"
            x2="67.23"
            y2="82.02"
          />
          <motion.line
            variants={unDraw}
            x1="84.29"
            y1="68.61"
            x2="106.29"
            y2="49.92"
          />
        </motion.g>
        <motion.g
          animate={isHover ? "visible" : "hidden"}
          stroke="#e37021"
          initial="hidden"
        >
          <motion.path
            variants={draw}
            d="M1.97 75.7c0,-25.41 12.84,-47.82 32.38,-61.1m6.36 -3.87c9.4,-5.09 20.03,-8.19 31.32,-8.76m7.44 -0c11.58,0.57 22.46,3.81 32.04,9.11m-9.54 15.3c-6.79,-3.61 -14.41,-5.86 -22.5,-6.39m-7.44 0.01c-7.87,0.52 -15.3,2.68 -21.94,6.13m-6.36 3.86c-14.38,10.1 -23.77,26.81 -23.77,45.71 0,30.84 25,55.84 55.84,55.84 26.32,0 48.39,-18.22 54.29,-42.73"
          />
          <motion.path
            variants={draw}
            d="M117.84 15.01c10.05,6.97 18.28,16.37 23.85,27.36l10.02 -7.23 0.63 42.11 -37.07 -17.29 11.24 -7.65c-4.08,-8.82 -10.39,-16.4 -18.21,-22.01"
          />
          <motion.circle variants={draw} cx="75.8" cy="75.7" r="10.86" />
          <motion.line
            variants={draw}
            x1="60.02"
            y1="88.15"
            x2="67.23"
            y2="82.02"
          />
          <motion.line
            variants={draw}
            x1="84.29"
            y1="68.61"
            x2="106.29"
            y2="49.92"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
