import { Layer } from '../model/Board';
import { useCallback, useRef } from 'react';
import { useSize } from './useSize';
import { LogEntryLine } from '../model/LogEntry';
import { ComponentMarker } from './ComponentMarker';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

export interface BoardViewerProps {
  title: string;
  layer: Layer;
  log?: Map<string, LogEntryLine>;
  markerSize?: number;
}

export function LayerRenderer({ layer, title, log }: BoardViewerProps) {
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
  const isErrorMode = log !== undefined;
  const {
    offsetX: naturalOffsetX,
    offsetY: naturalOffsetY,
    scale: naturalScale,
  } = useSize({
    containerRef,
    imageWidth: image?.width,
    imageHeight: image?.height,
  });
  const onUpdate = useCallback(({ x, y, scale }: any) => {
    const { current: img } = containerRef;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });

      img.style.setProperty('transform', value);
    }
  }, []);
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
          {image && (
            <div
              style={{
                position: 'relative',
                transformOrigin: 'center',
              }}
            >
              <img
                alt={'board'}
                src={image.data}
                style={{
                  position: 'absolute',
                  width: image.width * naturalScale,
                  height: image.height * naturalScale,
                }}
              />
            </div>
          )}
          <div
            style={{
              transform: `scale(${flipX}, ${flipY}) rotate(${rotation}deg)`,
              width: (image?.width ?? 0) * naturalScale,
              height: (image?.height ?? 0) * naturalScale,
              position: 'relative',
              top: offset.y,
              left: offset.x,
            }}
          >
            {components.map((c, ix) => {
              const error = log?.get(c.id);
              const hasError = isErrorMode && error !== undefined;
              // If we have an error log, we only show error
              if (isErrorMode && !hasError) {
                return null;
              }

              return (
                <ComponentMarker
                  component={c}
                  naturalScale={naturalScale}
                  scale={scale}
                  message={error ? JSON.stringify(error) : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>
    </QuickPinchZoom>
  );
}
