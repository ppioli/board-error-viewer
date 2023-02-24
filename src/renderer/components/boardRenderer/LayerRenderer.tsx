import { Component, Layer } from '../../../model/Board';
import { useCallback, useMemo, useRef } from 'react';
import { useSize } from '../../useSize';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { ComponentMarker } from './ComponentMarker';
import _ from 'lodash';
import classNames from 'classnames';

export interface BoardRendererProps {
  title: string;
  layer: Layer;
  markerSize?: number;
  filter?: (component: Component) => boolean;
  showLabel?: boolean;
}

export function LayerRenderer({
  layer,
  title,
  filter,
  showLabel = false,
}: BoardRendererProps) {
  console.log(layer);
  const {
    image,
    offset,
    components,
    scale,
    rotation,
    flip: { x: flipX, y: flipY },
  } = layer;
  const containerRef = useRef<HTMLDivElement | null>(null);
  // if we get a list of errors, we will display only components with errors
  let height = 100,
    width = 100;
  if (image) {
    width = image.width;
    height = image.height;
  } else {
    const maxX = _.maxBy(components, (c) => c.position.x)?.position.x;
    const maxY = _.maxBy(components, (c) => c.position.y)?.position.y;
    // TODO breaks when deleting an image when there are components
    if (maxX && maxY) {
      width = maxX;
      height = maxY;
    }
  }
  const {
    offsetX: naturalOffsetX,
    offsetY: naturalOffsetY,
    scale: naturalScale,
  } = useSize({
    containerRef,
    imageWidth: width,
    imageHeight: height,
  });
  const onUpdate = useCallback(({ x, y, scale }: any) => {
    const { current: img } = containerRef;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });
      img.style.setProperty('transform', value);
    }
  }, []);

  const filteredComponents = useMemo(() => {
    if (filter == undefined) {
      return components;
    }

    return components.filter(filter);
  }, [components, filter]);
  return (
    <QuickPinchZoom
      wheelScaleFactor={500}
      inertia={false}
      onUpdate={onUpdate}
      containerProps={{
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
        },
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
        ref={containerRef}
      >
        <div
          style={{
            position: 'absolute',
            left: naturalOffsetX,
            top: naturalOffsetY,
          }}
        >
          <div
            style={{
              position: 'relative',
              transformOrigin: 'center',
            }}
          >
            {image ? (
              <img
                alt={'board'}
                src={image.data}
                style={{
                  position: 'absolute',
                  width: width * naturalScale,
                  height: height * naturalScale,
                }}
              />
            ) : (
              <div
                className={
                  'd-flex justify-content-around flex-column text-center'
                }
                style={{
                  position: 'absolute',
                  width: width * naturalScale,
                  height: height * naturalScale,
                  opacity: 0.5,
                }}
              >
                <div>
                  <h1>{title}</h1>
                  <h4>No image</h4>
                </div>
              </div>
            )}
          </div>
          <div
            className={classNames({
              border: image == null,
              'border-primary': image == null,
            })}
            style={{
              transform: `scale(${flipX}, ${flipY}) rotate(${rotation}deg)`,
              width: width * naturalScale,
              height: height * naturalScale,
              position: 'relative',
              background: image == null ? '#ababab0f' : undefined,
              borderRadius: '8px',
              top: offset.y,
              left: offset.x,
            }}
          >
            {filteredComponents.map((c, ix) => {
              return (
                <ComponentMarker
                  component={c}
                  naturalScale={naturalScale}
                  scale={scale}
                  flipX={flipX}
                  flipY={flipY}
                  showLabel={showLabel}
                />
              );
            })}
          </div>
        </div>
      </div>
    </QuickPinchZoom>
  );
}
