import { Layer } from '../model/Board';
import { useRef } from 'react';
import { useSize } from './useSize';

export interface BoardViewerProps {
  title: string;
  layer: Layer;
}

const MARKER_SIZE = 15;

export function BoardViewer({ layer, title }: BoardViewerProps) {
  const { image, offset, components, scale } = layer;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    offsetX: naturalOffsetX,
    offsetY: naturalOffsetY,
    scale: naturalScale,
  } = useSize({
    containerRef,
    imageWidth: image?.width,
    imageHeight: image?.height,
  });

  console.log(scale, naturalScale)
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
                left: naturalOffsetX,
                top: naturalOffsetY,
                position: 'absolute',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              border: '1px solid red',
              left: offset.x + naturalOffsetX,
              top: offset.y + naturalOffsetY,
              width: 100,
              height: 100,
            }}
          >
            <div style={{ position: 'relative' }}>
              {components.map((c, ix) => (
                <div
                  key={c.id}
                  style={{
                    width: 19,
                    height: 19,
                    backgroundColor: 'red',
                    position: 'absolute',
                    left: c.position.x * naturalScale * scale.x,
                    top: c.position.y * naturalScale * scale.y,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
