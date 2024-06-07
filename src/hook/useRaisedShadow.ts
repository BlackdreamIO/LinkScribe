import { animate, MotionValue, useMotionValue } from "framer-motion";
import { useEffect } from "react";

const inactiveBorder = "0";

export function useRaisedShadow(value: MotionValue<number>) 
{
  const border = useMotionValue(inactiveBorder);

  useEffect(() => {
      let isActive = false;
      value.onChange((latest) => {
          const wasActive = isActive;
          if (latest !== 0) {
              isActive = true;
              if (isActive !== wasActive) {
                animate(border, "1");
              }
          } 
          else 
          {
            isActive = false;
              if (isActive !== wasActive) {
                animate(border, inactiveBorder);
              }
          }
      });
  }, [value, border]);

  return border;
}
