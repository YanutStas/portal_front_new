import * as React from "react";
import { motion } from "framer-motion";

export const IconDocument = ({ isHover = false }) => {
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
        viewBox="0 0 113.19 153.72"
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
            d="M94.05 19.71l13.37 0c2.09,0 3.8,1.71 3.8,3.8l0 124.44c0,2.09 -1.71,3.8 -3.8,3.8l-101.65 0c-2.09,0 -3.8,-1.71 -3.8,-3.8l0 -124.44c0,-2.09 1.71,-3.8 3.8,-3.8l13.04 0"
          />
          <motion.line
            variants={unDraw}
            x1="36.03"
            y1="47.28"
            x2="77.16"
            y2="47.27"
          />
          <motion.line
            variants={unDraw}
            x1="22.96"
            y1="69.23"
            x2="90.23"
            y2="69.22"
          />
          <motion.line
            variants={unDraw}
            x1="22.96"
            y1="86.66"
            x2="90.23"
            y2="86.65"
          />
          <motion.line
            variants={unDraw}
            x1="22.96"
            y1="104.08"
            x2="90.23"
            y2="104.08"
          />
          <motion.line
            variants={unDraw}
            x1="22.96"
            y1="121.51"
            x2="90.23"
            y2="121.5"
          />
          <motion.path
            variants={unDraw}
            d="M29.2 20.52l0 -4.63c0,-2.09 1.71,-3.8 3.8,-3.8l4.88 0c2.09,0 3.8,-1.71 3.8,-3.8l0 -2.52c0,-1.05 0.38,-1.95 1.12,-2.69 0.74,-0.74 1.65,-1.11 2.7,-1.11l22.48 0.13c2.09,0.01 3.78,1.71 3.78,3.8l0 2.39c0,2.09 1.71,3.8 3.8,3.8l4.63 0c2.09,0 3.8,1.71 3.8,3.8l0 4.63c0,2.09 -1.71,3.8 -3.8,3.8l-47.19 0c-2.09,0 -3.8,-1.71 -3.8,-3.8z"
          />
        </motion.g>
        <motion.g
          animate={isHover ? "visible" : "hidden"}
          stroke="#e37021"
          initial="hidden"
        >
          <motion.path
            variants={draw}
            d="M94.05 19.71l13.37 0c2.09,0 3.8,1.71 3.8,3.8l0 124.44c0,2.09 -1.71,3.8 -3.8,3.8l-101.65 0c-2.09,0 -3.8,-1.71 -3.8,-3.8l0 -124.44c0,-2.09 1.71,-3.8 3.8,-3.8l13.04 0"
          />
          <motion.line
            variants={draw}
            x1="36.03"
            y1="47.28"
            x2="77.16"
            y2="47.27"
          />
          <motion.line
            variants={draw}
            x1="22.96"
            y1="69.23"
            x2="90.23"
            y2="69.22"
          />
          <motion.line
            variants={draw}
            x2="22.96"
            y2="86.66"
            x1="90.23"
            y1="86.65"
          />
          <motion.line
            variants={draw}
            x1="22.96"
            y1="104.08"
            x2="90.23"
            y2="104.08"
          />
          <motion.line
            variants={draw}
            x2="22.96"
            y2="121.51"
            x1="90.23"
            y1="121.5"
          />
          <motion.path
            variants={draw}
            d="M29.2 20.52l0 -4.63c0,-2.09 1.71,-3.8 3.8,-3.8l4.88 0c2.09,0 3.8,-1.71 3.8,-3.8l0 -2.52c0,-1.05 0.38,-1.95 1.12,-2.69 0.74,-0.74 1.65,-1.11 2.7,-1.11l22.48 0.13c2.09,0.01 3.78,1.71 3.78,3.8l0 2.39c0,2.09 1.71,3.8 3.8,3.8l4.63 0c2.09,0 3.8,1.71 3.8,3.8l0 4.63c0,2.09 -1.71,3.8 -3.8,3.8l-47.19 0c-2.09,0 -3.8,-1.71 -3.8,-3.8z"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
