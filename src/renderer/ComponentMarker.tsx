import { Component, Vector } from '../model/Board';
import { LogEntryLine } from '../model/LogEntry';

const TEXT_BOX_SIZE = 100;
const MARKER_SIZE = 10;
export interface ComponentMarkerProps {
  component: Component;
  naturalScale: number;
  scale: Vector;
  markerSize?: number;
  textBoxSize?: number;
  message?: string;
}
export function ComponentMarker({
  component,
  naturalScale,
  scale,
  message,
  markerSize = MARKER_SIZE,
  textBoxSize = TEXT_BOX_SIZE,
}: ComponentMarkerProps) {
  return (
    <div
      key={component.id}
      style={{
        position: 'absolute',
        left: component.position.x * naturalScale * scale.x,
        top: component.position.y * naturalScale * scale.y,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => console.log(component)}
          style={{
            width: markerSize,
            height: markerSize,
            position: 'absolute',
            border: component.id.startsWith('QM80')
              ? '2px solid white'
              : '1px solid red',
            borderRadius: markerSize,
            background: 'red',
            top: -(markerSize / 2),
            left: -(markerSize / 2),
          }}
        />
        {
          <div
            className={'text-center'}
            style={{
              color: 'red',
              position: 'absolute',
              top: markerSize / 2 + 2,
              left: -(textBoxSize / 2),
              maxWidth: textBoxSize,
              width: textBoxSize,
            }}
          >
            {/*{`${component.id} (${component.position.y} - ${component.position.y})`}*/}
          </div>
        }
      </div>
    </div>
  );
}
