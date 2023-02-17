import { Component, Vector } from '../../../model/Board';
import { useState } from 'react';

const TEXT_BOX_SIZE = 100;
const MARKER_SIZE = 10;

export interface ComponentMarkerProps {
  component: Component;
  naturalScale: number;
  scale: Vector;
  flipX: number;
  flipY: number;
  showLabel?: boolean;
  markerSize?: number;
  textBoxSize?: number;
  message?: string;
  color?: string;
}

const COLOR_ACTIVE = '#ffffff';
const COLOR_INACTIVE = '#ff0000';

export function ComponentMarker({
  component,
  naturalScale,
  scale,
  message,
  flipX,
  flipY,
  color,
  showLabel = false,
  markerSize = MARKER_SIZE,
  textBoxSize = TEXT_BOX_SIZE,
}: ComponentMarkerProps) {
  console.log(flipX, flipX);
  const [active, setActive] = useState(false);
  const renderColor = color ?? (active ? COLOR_ACTIVE : COLOR_INACTIVE);
  return (
    <div
      key={component.id}
      style={{
        position: 'absolute',
        left: component.position.x * naturalScale * scale.x,
        top: component.position.y * naturalScale * scale.y,
        zIndex: active? 999999 : undefined,
      }}
    >
      <div style={{ position: 'relative'}}>
        <div
          onMouseOver={() => setActive(true)}
          onMouseOut={() => setActive(false)}
          style={{
            width: markerSize,
            height: markerSize,
            position: 'absolute',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: renderColor,
            borderRadius: markerSize,
            // TODO this will break depending on the color format. Probably should find a better way.
            backgroundColor: renderColor + '88',
            top: -(markerSize / 2),
            left: -(markerSize / 2),
          }}
        />
        {(active || showLabel) && (
          <div
            className={'text-center'}
            style={{
              pointerEvents: 'none',
              transform: `scaleX(${flipX}) scaleY(${flipY}`,
              color: renderColor,
              textShadow: '1px 1px 1px #000000',
              position: 'absolute',
              top: markerSize / 2 + 2,
              left: -(textBoxSize / 2),
              maxWidth: textBoxSize,
              width: textBoxSize,
              fontSize: 5,
            }}
          >
            <div>{`${component.id}`}</div>
            {message && <div>{message}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
