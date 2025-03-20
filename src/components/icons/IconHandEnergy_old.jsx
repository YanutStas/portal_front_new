import * as React from "react";
import { motion } from "framer-motion";
import { draw, unDraw } from "./paramsForIcon";
export const IconHandEnergy = ({ isHover = false }) => {
  return (
    <motion.div style={{ width: "100%", height: "100%" }}>
      <motion.svg
        width={"100%"}
        height={"100%"}
        viewBox="-.2 -.2 8 8"
        style={{
          strokeWidth: 0.3,
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
              d="M0.93 4.27c0,0 0.28,-0.26 0.52,-0.11 0.25,0.15 0.94,0.74 0.94,0.74m-0.19 0.24c-0.52,-0.33 -1,-0.79 -1.56,-1.01 -0.18,-0.07 -0.75,0.23 -0.46,0.65 0.3,0.42 3.17,2.41 3.25,2.43 0.09,0.02 2.38,-0.37 2.7,-0.3 0.32,0.07 0.42,0.23 0.53,0.18 0.11,-0.06 0.9,-0.97 0.83,-1.19 -0.08,-0.21 -1.63,-1.24 -1.97,-1.33 -0.34,-0.08 -2.98,0.31 -3.13,0.33 -0.16,0.01 -0.54,0.89 0.11,0.86 0.66,-0.03 2.15,-0.22 2.33,-0.24 0.18,-0.02 0.42,0.57 0.05,0.61 -0.36,0.03 -1.43,-0.45 -1.43,-0.45"
            />
            <motion.polygon
              variants={unDraw}
              points="3.86,0.1 2.61,2.39 3.96,2.42 3.71,4.1 4.99,1.82 3.63,1.78 "
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
              d="M0.93 4.27c0,0 0.28,-0.26 0.52,-0.11 0.25,0.15 0.94,0.74 0.94,0.74m-0.19 0.24c-0.52,-0.33 -1,-0.79 -1.56,-1.01 -0.18,-0.07 -0.75,0.23 -0.46,0.65 0.3,0.42 3.17,2.41 3.25,2.43 0.09,0.02 2.38,-0.37 2.7,-0.3 0.32,0.07 0.42,0.23 0.53,0.18 0.11,-0.06 0.9,-0.97 0.83,-1.19 -0.08,-0.21 -1.63,-1.24 -1.97,-1.33 -0.34,-0.08 -2.98,0.31 -3.13,0.33 -0.16,0.01 -0.54,0.89 0.11,0.86 0.66,-0.03 2.15,-0.22 2.33,-0.24 0.18,-0.02 0.42,0.57 0.05,0.61 -0.36,0.03 -1.43,-0.45 -1.43,-0.45"
            />
            <motion.polygon
              variants={draw}
              points="3.86,0.1 2.61,2.39 3.96,2.42 3.71,4.1 4.99,1.82 3.63,1.78 "
            />
          </motion.g>
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
