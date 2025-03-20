import * as React from "react";
import { motion } from "framer-motion";

export const IconFolder = ({ isHover = false }) => {
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
        viewBox="0 0 220.49 212"
        style={{
          strokeWidth: 6.23,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      >
        <motion.g
          animate={isHover ? "visible" : "hidden"}
          stroke="#0061aa"
          initial="hidden"
        >
          <motion.path
            variants={unDraw}
            d="M216.63 96.23c-1.1,-1.69 -2.83,-2.63 -4.84,-2.64l-127.32 -0.61c-2.38,-0.01 -4.41,1.32 -5.36,3.5l-47.12 109.11c-0.94,2.17 -2.96,3.5 -5.33,3.5l-18.13 0.01"
          />
          <motion.path
            variants={unDraw}
            d="M138.07 76.49l-0.02 -5.23c-0.01,-3.19 -2.62,-5.79 -5.82,-5.79l-65.53 0.13c-1.57,0 -2.93,-0.55 -4.06,-1.65l-10.95 -10.66c-1.13,-1.1 -2.48,-1.64 -4.05,-1.64l-38.94 0c-3.19,0 -5.8,2.61 -5.8,5.8l0 145.83c0,3.19 2.61,5.8 5.8,5.8l157.32 0c2.35,0 4.36,-1.31 5.31,-3.47l45.74 -103.9c0.81,-1.84 0.65,-3.81 -0.44,-5.5"
          />
          <motion.path
            variants={unDraw}
            d="M178.55 82.01l17.02 -16.64 17.02 -16.64 -17.6 0 0.28 -39.86c0.01,-1.6 -0.55,-2.99 -1.68,-4.13 -1.13,-1.14 -2.51,-1.72 -4.11,-1.72l-45.79 -0.12 11.59 3.59c2.45,0.76 4.06,2.93 4.09,5.5l0.3 36.73 -15.17 0 17.02 16.64 17.02 16.64z"
          />
        </motion.g>
        <motion.g
          animate={isHover ? "visible" : "hidden"}
          stroke="#e37021"
          initial="hidden"
        >
          <motion.path
            variants={draw}
            d="M216.63 96.23c-1.1,-1.69 -2.83,-2.63 -4.84,-2.64l-127.32 -0.61c-2.38,-0.01 -4.41,1.32 -5.36,3.5l-47.12 109.11c-0.94,2.17 -2.96,3.5 -5.33,3.5l-18.13 0.01"
          />
          <motion.path
            variants={draw}
            d="M138.07 76.49l-0.02 -5.23c-0.01,-3.19 -2.62,-5.79 -5.82,-5.79l-65.53 0.13c-1.57,0 -2.93,-0.55 -4.06,-1.65l-10.95 -10.66c-1.13,-1.1 -2.48,-1.64 -4.05,-1.64l-38.94 0c-3.19,0 -5.8,2.61 -5.8,5.8l0 145.83c0,3.19 2.61,5.8 5.8,5.8l157.32 0c2.35,0 4.36,-1.31 5.31,-3.47l45.74 -103.9c0.81,-1.84 0.65,-3.81 -0.44,-5.5"
          />
          <motion.path
            variants={draw}
            d="M178.55 82.01l17.02 -16.64 17.02 -16.64 -17.6 0 0.28 -39.86c0.01,-1.6 -0.55,-2.99 -1.68,-4.13 -1.13,-1.14 -2.51,-1.72 -4.11,-1.72l-45.79 -0.12 11.59 3.59c2.45,0.76 4.06,2.93 4.09,5.5l0.3 36.73 -15.17 0 17.02 16.64 17.02 16.64z"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
