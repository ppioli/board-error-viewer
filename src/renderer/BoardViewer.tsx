import { Layer } from '../model/Board';
import { useRef, useState } from 'react';
import { useSize } from './useSize';
import { LogEntryLine } from '../model/LogEntry';
import { ComponentMarker } from './ComponentMarker';

export interface BoardViewerProps {
  title: string;
  layer: Layer;
  log?: Map<string, LogEntryLine>;
  markerSize?: number;
}

export function BoardViewer({ layer, title, log }: BoardViewerProps) {
  const { image, offset, components, scale, rotation } = layer;
  const containerRef = useRef<HTMLDivElement | null>(null);
  // if we get a list of errors, we will display only components with errors
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
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
  // TODO find style type
  const style: any = {
    transform: `scale(${flipX ? '-1' : '1'}, ${flipY ? '-1' : '1'})`,
    width: (image?.width ?? 1) * naturalScale,
    height: (image?.height ?? 1) * naturalScale,
    border: '1px solid red',
  };
  return (
    <div className={'card h-100 w-100'}>
      <div className={'card-header'}>{title}</div>
      <div className={'card-body'}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            border: '1px solid black',
          }}
          ref={containerRef}
        >
          {image && (
            <img
              alt={'board'}
              src={image.data}
              style={{
                width: image.width * naturalScale,
                height: image.height * naturalScale,
                transform: `rotation(${rotation}deg)`,
                left: naturalOffsetX,
                top: naturalOffsetY,
                position: 'absolute',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              top: offset.y + naturalOffsetY,
              left: offset.x + naturalOffsetX,
            }}
          >
            <div style={{ position: 'relative', ...style }}>
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
          <div style={{ position: 'absolute', zIndex: 99999 }}>
            <button
              className={'btn btn-primary'}
              onClick={() => setFlipX((s) => !s)}
            >
              flipX
            </button>
            <button
              className={'btn btn-primary'}
              onClick={() => setFlipY((s) => !s)}
            >
              flipY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
