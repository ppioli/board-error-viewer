import { MutableRefObject, useLayoutEffect, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

export interface UseSizeOpts {
  margins?: Margin;
  containerRef: MutableRefObject<HTMLElement | null>;
  imageWidth?: number;
  imageHeight?: number;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const defaultMargins: Margin = {
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
};

export interface CanvasPosition {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export const useSize = ({
  margins = defaultMargins,
  containerRef,
  imageHeight,
  imageWidth,
}: UseSizeOpts): CanvasPosition => {
  const [containerSize, setContainerSize] = useState<DOMRectReadOnly>();
  useLayoutEffect(() => {
    if (containerRef.current === null) {
      return;
    }
    setContainerSize(containerRef.current.getBoundingClientRect());
  }, [containerRef]);
  // Where the magic happens
  useResizeObserver(containerRef, (entry) =>
    setContainerSize(entry.contentRect)
  );

  if( !imageWidth || !imageHeight || containerRef.current == null) {
    return {
      scale: 1,
      offsetY: 0,
      offsetX: 0
    }
  }

  const availableWidth = (containerSize?.width ?? 0) - margins.left - margins.right;
  const availableHeight = (containerSize?.height ?? 0) - margins.top - margins.bottom;

  // image 'width' ratio
  const imageRatio = imageWidth / imageHeight;
  // container 'width' ratio
  const containerRatio = availableWidth / availableHeight;

  let scale = imageRatio > containerRatio ? availableWidth / imageWidth : availableHeight / imageHeight;
  let offsetY = margins.top + ( availableHeight - ( imageHeight * scale ) ) / 2;
  let offsetX = margins.left + ( availableWidth - ( imageWidth * scale ) ) / 2;
  return {
   scale,
   offsetX,
   offsetY
  };
};
