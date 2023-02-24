import useResizeObserver from '@react-hook/resize-observer';
import { RefObject, useLayoutEffect, useState } from 'react';

export const useSizeObserver: (target: RefObject<HTMLDivElement>) => [number, number] = (target: RefObject<HTMLDivElement>) => {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useLayoutEffect(() => {
    const rect = target.current?.getBoundingClientRect() ?? {
      width: 0,
      height: 0,
    };
    setSize([rect.width, rect.height]);
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => {
    const rect = entry.contentRect;
    setSize([rect.width, rect.height]);
  });
  return size;
};
