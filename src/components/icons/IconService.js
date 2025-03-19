import * as React from "react";
import { motion } from "framer-motion";

export const IconService = ({ isHover = false }) => {
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
        viewBox="0 0 219.31 233.79"
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
            d="M142.17 96.09c8.62,8.62 13.47,20.32 13.47,32.52 0,25.4 -20.59,45.99 -45.99,45.99 -25.4,0 -45.99,-20.59 -45.99,-45.99 0,-8.07 2.13,-16 6.16,-22.99"
          />
          <motion.path
            variants={unDraw}
            d="M142.25 27.13c15.53,4.98 29.51,13.43 41.02,24.43l-9.35 25.45 13.27 22.99 26.29 4.56c1.78,7.73 2.72,15.78 2.72,24.05 0,8.58 -1.02,16.92 -2.94,24.92l-26.62 4.61 -13.27 22.99 9.23 25.13c-11.88,11.17 -26.33,19.64 -42.36,24.43l-17.49 -20.96 -26.54 0 -17.42 20.89c-15.97,-4.82 -30.36,-13.3 -42.2,-24.45l9.54 -25.97 -13.27 -22.99 -27.07 -4.69c-1.76,-7.69 -2.69,-15.69 -2.69,-23.91 0,-8.53 1.01,-16.83 2.91,-24.78l27.4 -4.75 13.27 -22.99 -9.42 -25.65c10.82,-10.02 23.72,-17.83 37.99,-22.69"
          />
          <motion.polygon
            variants={unDraw}
            points="62.43,90.89 92.17,3.11 141.72,3.11 120.54,61.89 148.67,61.89 96.34,142.06 94.19,90.89 "
          />
        </motion.g>
        <motion.g
          animate={isHover ? "visible" : "hidden"}
          stroke="#e37021"
          initial="hidden"
        >
          <motion.path
            variants={draw}
            d="M142.17 96.09c8.62,8.62 13.47,20.32 13.47,32.52 0,25.4 -20.59,45.99 -45.99,45.99 -25.4,0 -45.99,-20.59 -45.99,-45.99 0,-8.07 2.13,-16 6.16,-22.99"
          />
          <motion.path
            variants={draw}
            d="M142.25 27.13c15.53,4.98 29.51,13.43 41.02,24.43l-9.35 25.45 13.27 22.99 26.29 4.56c1.78,7.73 2.72,15.78 2.72,24.05 0,8.58 -1.02,16.92 -2.94,24.92l-26.62 4.61 -13.27 22.99 9.23 25.13c-11.88,11.17 -26.33,19.64 -42.36,24.43l-17.49 -20.96 -26.54 0 -17.42 20.89c-15.97,-4.82 -30.36,-13.3 -42.2,-24.45l9.54 -25.97 -13.27 -22.99 -27.07 -4.69c-1.76,-7.69 -2.69,-15.69 -2.69,-23.91 0,-8.53 1.01,-16.83 2.91,-24.78l27.4 -4.75 13.27 -22.99 -9.42 -25.65c10.82,-10.02 23.72,-17.83 37.99,-22.69"
          />
          <motion.polygon
            variants={draw}
            points="62.43,90.89 92.17,3.11 141.72,3.11 120.54,61.89 148.67,61.89 96.34,142.06 94.19,90.89 "
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
