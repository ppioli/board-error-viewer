import { Component, Vector } from '../../../model/Board';
import { useMemo, useState } from 'react';
import Color from 'colorjs.io';
import { LogEntryLine } from '../../../model/LogEntry';

const TEXT_BOX_SIZE = 100;
const MARKER_SIZE = 10;

export interface ComponentMarkerProps {
  component: Component;
  naturalScale: number;
  scale: Vector;
  flipX: number;
  flipY: number;
  markerSize: number;
  color: string;
  showLabel?: boolean;
  textBoxSize?: number;
  message?: string[] | LogEntryLine[];
}

const normalizeMessage = (message: string | string[]) => {
  if (Array.isArray(message)) {
    return message;
  }
  return [message];
};

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
  const [active, setActive] = useState(false);

  const [colorAlpha, colorActive, colorActiveAlpha] = useMemo(() => {
    const bgColor = new Color(color);
    bgColor.alpha = 0.6;

    const colorActive = new Color(color);
    colorActive.lighten(0.4);

    const colorActiveAlpha = new Color(color);
    colorActiveAlpha.lighten(0.4);
    colorActiveAlpha.alpha = 0.6;
    return [
      bgColor.toString(),
      colorActive.toString(),
      colorActiveAlpha.toString(),
    ];
  }, [color]);
  return (
    <div
      key={component.id}
      style={{
        position: 'absolute',
        left: component.position.x * naturalScale * scale.x,
        top: component.position.y * naturalScale * scale.y,
        zIndex: active ? 999999 : undefined,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          onMouseOver={() => setActive(true)}
          onMouseOut={() => setActive(false)}
          style={{
            width: markerSize,
            height: markerSize,
            position: 'absolute',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: active ? colorActive : color,
            borderRadius: markerSize,
            backgroundColor: active ? colorActiveAlpha : colorAlpha,
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
              color: active ? colorActive : color,
              textShadow: '0px 0px 5px #000000',
              position: 'absolute',
              top: markerSize / 2 + 2,
              left: -(textBoxSize / 2),
              maxWidth: textBoxSize,
              width: textBoxSize,
              fontSize: 12,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: '1px solid red',
              }}
            >
              <div>{`${component.id}`}</div>
              {message && <MarkerMessage message={message} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MarkerMessage({
  message,
}: {
  message: string[] | LogEntryLine[];
}) {
  if (message.length == 0) {
    return null;
  }
  if (typeof message[0] === 'string') {
    return (
      <>
        {message.map((m) => (
          <div>{m as string}</div>
        ))}
      </>
    );
  }
  const codes = message.map((m) => (m as LogEntryLine).code);
  return (
    <>
      {[...new Set(codes)].map((c) => (
        <div>**{c}**</div>
      ))}
    </>
  );
}
