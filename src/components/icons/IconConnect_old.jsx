import * as React from "react";
import { motion } from "framer-motion";

export const IconConnect = ({ isHover = false }) => {
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
        viewBox="0 0 97.06 97.06"
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
          <motion.g>
            <motion.path
              variants={unDraw}
              d="M50.76 77.17l-30.87 -30.87 -6.72 6.72c-7.04,7.04 -7.04,18.55 0,25.58l5.29 5.29c7.03,7.03 18.54,7.03 25.57,0l6.73 -6.72z"
            />
            <motion.line
              variants={unDraw}
              x1="15.81"
              y1="81.25"
              x2="3.62"
              y2="93.44"
            />
          </motion.g>
          <motion.g>
            <motion.path
              variants={unDraw}
              d="M77.17 50.76l-30.87 -30.87 6.72 -6.72c7.04,-7.04 18.55,-7.04 25.58,0l5.29 5.29c7.03,7.03 7.03,18.54 0,25.57l-6.72 6.73z"
            />
            <motion.line
              variants={unDraw}
              x1="81.25"
              y1="15.81"
              x2="93.44"
              y2="3.62"
            />
            <motion.line
              variants={unDraw}
              x1="70.56"
              y1="44.24"
              x2="54.46"
              y2="60.35"
            />
            <motion.line
              variants={unDraw}
              x1="52.99"
              y1="26.66"
              x2="37.05"
              y2="42.6"
            />
          </motion.g>
        </motion.g>
        <motion.g
          animate={isHover ? "visible" : "hidden"}
          stroke="#e37021"
          initial="hidden"
        >
          <motion.g>
            <motion.path
              variants={draw}
              d="M50.76 77.17l-30.87 -30.87 -6.72 6.72c-7.04,7.04 -7.04,18.55 0,25.58l5.29 5.29c7.03,7.03 18.54,7.03 25.57,0l6.73 -6.72z"
            />
            <motion.line
              variants={draw}
              x1="15.81"
              y1="81.25"
              x2="3.62"
              y2="93.44"
            />
          </motion.g>
          <motion.g>
            <motion.path
              variants={draw}
              d="M77.17 50.76l-30.87 -30.87 6.72 -6.72c7.04,-7.04 18.55,-7.04 25.58,0l5.29 5.29c7.03,7.03 7.03,18.54 0,25.57l-6.72 6.73z"
            />
            <motion.line
              variants={draw}
              x1="81.25"
              y1="15.81"
              x2="93.44"
              y2="3.62"
            />
            <motion.line
              variants={draw}
              x1="70.56"
              y1="44.24"
              x2="54.46"
              y2="60.35"
            />
            <motion.line
              variants={draw}
              x1="52.99"
              y1="26.66"
              x2="37.05"
              y2="42.6"
            />
          </motion.g>
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
