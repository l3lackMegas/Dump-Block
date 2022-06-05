import React, { useState } from "react";

import {
    AnimatePresence,
    motion,
    useMotionValue,
    useTransform,
} from "framer-motion"

import { range as _range, random as _random } from "lodash";


const colors = ["#BCECE0", "#36EEE0", "#F652A0", "#4C5270"];

const makeRgbColor = () => colors[_random(0, 3)];

const generateDataset = () => {
  const range = _range(0, 70);
  return range.map(() => [_random(1, 100), _random(1, 100), makeRgbColor()]);
};

let ii: any;
const Bubbles = () => {
    const [dataset, setDataset] = useState(generateDataset());

    clearInterval(ii);
    ii = setInterval(() => {
      const newDataset = generateDataset();
      setDataset(newDataset);
    }, 20e3);
  
    return (
      <AnimatePresence exitBeforeEnter>
        <svg viewBox="0 0 100 100" opacity={.25}>
          {dataset.map(([x, y, z]: any, index: any) => (
            <motion.circle
              key={index}
              layoutId={`circle-${index}`}
              cx={x}
              cy={y}
              fill={z}
              animate={{ cx: x, cy: y, fill: z }}
              transition={{
                duration: 30,
                ease: 'linear'
              }}
              r={(index % 5) == 0 ? 1 : index % 5}
            />
          ))}
        </svg>
      </AnimatePresence>
    );
}

export default Bubbles;