import * as React from "react";
import { motion } from "framer-motion";

export const IconConnectNew = ({ isHover = false }) => {
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
        viewBox="0 0 174.54 173.14"
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
          <motion.path
            variants={unDraw}
            d="M45.68 78.79l48.67 48.67c3.05,3.05 3.05,8.04 0,11.09l-0.68 0.68c-3.05,3.05 -8.04,3.05 -11.09,0l-48.67 -48.67c-3.05,-3.05 -3.05,-8.04 0,-11.09l0.68 -0.68c3.05,-3.05 8.04,-3.05 11.09,0z"
          />

          <motion.path
            variants={unDraw}
            d="M84.23 140.87l-19.67 19.67c-13.72,13.72 -36.18,13.72 -49.91,0l-2.06 -2.06c-13.72,-13.72 -13.72,-36.18 0,-49.91l19.71 -19.71"
          />
          <motion.path
            variants={unDraw}
            d="M62.64 88.41l15.71 -15.71c2.29,-2.29 2.29,-6.03 0,-8.32l-0.93 -0.93c-2.29,-2.29 -6.03,-2.29 -8.32,0l-15.71 15.71"
          />
          <motion.path
            variants={unDraw}
            d="M94.39 120.16l15.71 -15.71c2.29,-2.29 2.29,-6.03 0,-8.32l-0.93 -0.93c-2.29,-2.29 -6.03,-2.29 -8.32,0l-15.71 15.71"
          />
          <motion.polygon
            variants={unDraw}
            points="121.89,40.07 142.66,10.29 139.64,30.78 152.2,30.73 131.44,60.66 134.79,40.13 "
          />

          <motion.path
            variants={unDraw}
            d="M128.86 94.35l-48.67 -48.67c-3.05,-3.05 -3.05,-8.04 0,-11.09l0.68 -0.68c3.05,-3.05 8.04,-3.05 11.09,0l48.67 48.67c3.05,3.05 3.05,8.04 0,11.09l-0.68 0.68c-3.05,3.05 -8.04,3.05 -11.09,0z"
          />
          <motion.path
            variants={unDraw}
            d="M90.31 32.27l19.67 -19.67c13.72,-13.72 36.18,-13.72 49.91,0l2.06 2.06c13.72,13.72 13.72,36.18 0,49.91l-19.71 19.71"
          />
          <motion.rect
            variants={unDraw}
            transform="matrix(-0.707107 -0.707107 0.707107 -0.707107 55.8339 140.654)"
            width="33.29"
            height="12.58"
            rx="4.6"
            ry="4.6"
          />
          <motion.line
            variants={unDraw}
            x1="40.99"
            y1="141.41"
            x2="31.36"
            y2="131.77"
          />
          <motion.line
            variants={unDraw}
            x1="32.27"
            y1="150.13"
            x2="22.63"
            y2="140.5"
          />
        </motion.g>
        <motion.g
          animate={isHover ? "visible" : "hidden"}
          stroke="#e37021"
          initial="hidden"
        >
          <motion.path
            variants={draw}
            d="M45.68 78.79l48.67 48.67c3.05,3.05 3.05,8.04 0,11.09l-0.68 0.68c-3.05,3.05 -8.04,3.05 -11.09,0l-48.67 -48.67c-3.05,-3.05 -3.05,-8.04 0,-11.09l0.68 -0.68c3.05,-3.05 8.04,-3.05 11.09,0z"
          />
          <motion.path
            variants={draw}
            d="M84.23 140.87l-19.67 19.67c-13.72,13.72 -36.18,13.72 -49.91,0l-2.06 -2.06c-13.72,-13.72 -13.72,-36.18 0,-49.91l19.71 -19.71"
          />
          <motion.path
            variants={draw}
            d="M62.64 88.41l15.71 -15.71c2.29,-2.29 2.29,-6.03 0,-8.32l-0.93 -0.93c-2.29,-2.29 -6.03,-2.29 -8.32,0l-15.71 15.71"
          />
          <motion.path
            variants={draw}
            d="M94.39 120.16l15.71 -15.71c2.29,-2.29 2.29,-6.03 0,-8.32l-0.93 -0.93c-2.29,-2.29 -6.03,-2.29 -8.32,0l-15.71 15.71"
          />
          <motion.polygon
            variants={draw}
            points="121.89,40.07 142.66,10.29 139.64,30.78 152.2,30.73 131.44,60.66 134.79,40.13 "
          />

          <motion.path
            variants={draw}
            d="M128.86 94.35l-48.67 -48.67c-3.05,-3.05 -3.05,-8.04 0,-11.09l0.68 -0.68c3.05,-3.05 8.04,-3.05 11.09,0l48.67 48.67c3.05,3.05 3.05,8.04 0,11.09l-0.68 0.68c-3.05,3.05 -8.04,3.05 -11.09,0z"
          />
          <motion.path
            variants={draw}
            d="M90.31 32.27l19.67 -19.67c13.72,-13.72 36.18,-13.72 49.91,0l2.06 2.06c13.72,13.72 13.72,36.18 0,49.91l-19.71 19.71"
          />
          <motion.rect
            variants={draw}
            transform="matrix(-0.707107 -0.707107 0.707107 -0.707107 55.8339 140.654)"
            width="33.29"
            height="12.58"
            rx="4.6"
            ry="4.6"
          />
          <motion.line
            variants={draw}
            x1="40.99"
            y1="141.41"
            x2="31.36"
            y2="131.77"
          />
          <motion.line
            variants={draw}
            x1="32.27"
            y1="150.13"
            x2="22.63"
            y2="140.5"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
