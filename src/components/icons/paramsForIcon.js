export const draw = {
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
export const unDraw = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 0,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { delay: 0.5, duration: 0.5 },
    },
  },
};
