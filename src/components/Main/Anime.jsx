import * as React from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import styles from "./Anime.module.css";
import { Typography, theme } from "antd";
const arr = [
  "M137.6,0.1L157,53.7h-6.6l-12.9-30l-12.9,30h-6.6L137.6,0.1z",
  "M73.2,21.6l36.7,35.8l-5.3,2.6L82.4,40.7l1.3,29.2l-5.3,2.6L73.2,21.6z",
  "M27.1,63l42.9,14.7l-3.2,4l-25-7l12.2,22.7l-3.2,4L27.1,63z",
  "M1.8,117.3l42.9-4.7l-1.2,5l-23.4,4.2l18.5,15.5l-1.3,5L1.8,117.3z",
  "M205.1,22.4L168,57.8l5.2,2.6l22.4-19l-1.7,29.2l5.2,2.6L205.1,22.4z",
  "M249.5,63l-42.9,14.7l3.2,4l25-7l-12.2,22.8l3.2,4L249.5,63z",
  "M274.1,114.8l-42.9-3.9l1.3,5l23.5,3.8l-18.2,15.8l1.3,5L274.1,114.8z",
  "M137.6,300.1l19.4-53.6h-6.6l-12.9,30l-12.9-30h-6.6L137.6,300.1z",
  "M75.6,279.8l36.1-36.4l-5.4-2.5l-21.8,19.7l0.8-29.2l-5.3-2.5L75.6,279.8z",
  "M24.3,233.8l43.3-13.3l-3.1-4.1l-25.1,6.2l12.9-22.3l-3.1-4.1L24.3,233.8z",
  "M201,279.8l-36.1-36.4l5.3-2.5l21.8,19.7l-0.8-29.2l5.3-2.5L201,279.8z",
  "M252.1,234.1l-43.3-13.5l3.1-4.1l25.2,6.3l-12.9-22.4l3.1-4.1L252.1,234.1z",
  "M275.5,180.2l-42.8,5.6l1.1-5l23.3-4.7l-18.8-15.1l1.1-5.1L275.5,180.2z",
  "M0.7,178.2l42.7,6.2l-1.1-5l-23.2-5l19-14.8l-1.1-5L0.7,178.2z",
  "M138.1,59.7c50.2,0,91,40.5,91,90.4s-40.8,90.4-91,90.4s-91-40.5-91-90.4S87.8,59.7,138.1,59.7L138.1,59.7z M138.1,78.4 c-39.9,0-72.2,32.1-72.2,71.7s32.3,71.8,72.2,71.8s72.2-32.2,72.2-71.8S177.9,78.4,138.1,78.4z",
];

const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: "rgba(227, 112, 33, 0)",
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    fill: "rgba(227, 112, 33, 1)",
  },
};

export const Anime = () => {
  const { colorPrimary } = theme.useToken().token;

  return (
    <>

      <div className={styles.container}>
        {/* <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 2, delay: 3.5 }}
          style={{ position: "absolute", bottom: 60, zIndex: 5, width: "100vw" }}
        >
          <Typography.Title
            style={{
              textTransform: "uppercase",
              fontSize: 84,
              fontWeight: 800,
              color: "rgba(0, 97, 170,.1)",
              // color: "rgba(227, 112, 33, 1)",
              textAlign: "center",
            }}
          >
            на благо подмосковья
          </Typography.Title>
        </motion.div> */}

        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 275.8 300.5"
          className={styles.item}
          height={300}
          width={500}
          style={{ zIndex: 10 }}
        >
          {arr.map((item, index) => (
            <motion.path
              key={index}
              d={item}
              variants={icon}
              initial="hidden"
              animate="visible"
              transition={{
                default: { duration: 3, ease: "easeInOut" },
                fill: { duration: 3, ease: [1, 0, 0.8, 1], delay: 1 },
              }}
            />
          ))}
        </motion.svg>
        {/* <motion.div
          initial={{ opacity: 0, }}
          animate={{ opacity: 1, }}
          transition={{ ease: "easeOut", duration: 2, delay: 3.5 }}
          style={{ position: "absolute", top: 50, left: -60, zIndex: 10 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200px"
            height="200px"
            // style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
            viewBox="0 0 160.83 243.91">
            <path style={{ fill: "rgba(227, 112, 33, 1)" }} class="fil0" d="M160.83 215.42l0 28.49 -160.8 0c-0.23,-7.18 0.96,-14.08 3.5,-20.75 4.13,-10.91 10.75,-21.71 19.85,-32.28 9.1,-10.58 22.11,-22.79 39.01,-36.64 26.29,-21.66 44.16,-38.79 53.49,-51.45 9.38,-12.67 14.08,-24.65 14.08,-35.96 0,-11.82 -4.25,-21.77 -12.73,-29.91 -8.48,-8.08 -19.56,-12.16 -33.18,-12.16 -14.42,0 -25.96,4.3 -34.61,12.89 -8.65,8.54 -13,20.42 -13.11,35.63l-30.54 -3.06c2.1,-22.84 10.01,-40.25 23.69,-52.24 13.74,-11.99 32.12,-17.98 55.24,-17.98 23.3,0 41.79,6.45 55.36,19.39 13.62,12.95 20.41,29.01 20.41,48.12 0,9.72 -1.98,19.28 -6,28.66 -3.95,9.45 -10.57,19.34 -19.79,29.74 -9.27,10.35 -24.59,24.65 -45.96,42.75 -17.93,15.04 -29.46,25.21 -34.55,30.58 -5.09,5.38 -9.27,10.75 -12.61,16.18l119.25 0z" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, }}
          animate={{ opacity: 1, }}
          transition={{ ease: "easeOut", duration: 2, delay: 3.5 }}
          style={{ position: "absolute", top: 150, right: -200, zIndex: 10 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="300px"
            height="100px"
            // style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
            viewBox="0 0 393.99 138.9">
            <path style={{ fill: "rgba(227, 112, 33, 1)" }} class="fil0" d="M24.91 2.82l105.01 0 0 133.13 -22.6 0 0 -114.38 -59.82 0 0 66.28c0,15.45 -0.51,25.64 -1.5,30.6 -1.03,4.92 -3.76,9.2 -8.26,12.88 -4.53,3.68 -11.04,5.52 -19.55,5.52 -5.27,0 -11.34,-0.34 -18.19,-0.98l0 -18.79 9.88 0c4.67,0 8.01,-0.47 10.02,-1.46 2.01,-0.94 3.34,-2.48 4.02,-4.57 0.64,-2.1 0.99,-8.9 0.99,-20.42l0 -87.81zm229.66 90.12l23.37 3.09c-3.64,13.56 -10.45,24.13 -20.37,31.62 -9.93,7.49 -22.6,11.25 -38.05,11.25 -19.42,0 -34.83,-5.99 -46.21,-17.97 -11.38,-11.94 -17.08,-28.76 -17.08,-50.37 0,-22.33 5.74,-39.71 17.25,-52.03 11.51,-12.37 26.45,-18.53 44.8,-18.53 17.76,0 32.27,6.03 43.52,18.14 11.26,12.11 16.91,29.15 16.91,51.1 0,1.32 -0.05,3.34 -0.13,5.99l-99.24 0c0.86,14.59 4.97,25.8 12.41,33.55 7.4,7.74 16.69,11.64 27.77,11.64 8.26,0 15.32,-2.18 21.14,-6.55 5.87,-4.36 10.49,-11.34 13.91,-20.93zm-73.94 -36.2l74.2 0c-0.99,-11.21 -3.85,-19.6 -8.52,-25.2 -7.14,-8.69 -16.47,-13.05 -27.9,-13.05 -10.35,0 -19.04,3.46 -26.1,10.39 -7.02,6.94 -10.91,16.22 -11.68,27.86zm105.52 -53.92l107.84 0 0 18.75 -42.62 0 0 114.51 -22.6 0 0 -114.51 -42.62 0 0 -18.75z" />
          </svg>
        </motion.div> */}
      </div>




      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 1, delay: 2.5 }}
      >
        <Typography.Title
          style={{
            textTransform: "uppercase",
            color: colorPrimary,
            textAlign: "center",
          }}
        >
          Портал цифровых услуг
        </Typography.Title>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 3, delay: 3.5 }}
      >
        <Typography.Title
          style={{
            textTransform: "uppercase",
            color: colorPrimary,
            textAlign: "center",
            marginTop: "-20px",
          }}
        >
          <TypeAnimation
            sequence={[
              "Технологическое присоединение",
              1000,
              "Коммерческие услуги",
              1000,
              "Учёт электрической энергии",
              1000,
              "Сервисные услуги",
              1000,
            ]}
            speed={50}
            style={{
              textTransform: "uppercase",
              color: colorPrimary,
              fontSize: "1.5rem",
            }}
            repeat={Infinity}
          />
        </Typography.Title>
      </motion.div>
    </>
  );
};
