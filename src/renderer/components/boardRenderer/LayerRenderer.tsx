import { Board, Component, defaultLayer, Layer } from '../../../model/Board';
import { useCallback, useMemo, useRef } from 'react';
import { useSize } from '../../useSize';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { ComponentMarker, ComponentMarkerProps } from './ComponentMarker';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectDimension, selectLayerComponentsIds, selectTopLayer } from '../../boardEdit/boardSlice';

export interface BoardRendererProps {
  title: string;
  filter?: (component: Component) => boolean;
  showLabel?: boolean;
  markerBuilder?: (markerProps: ComponentMarkerProps) => ComponentMarkerProps;
}

export function LayerRenderer({
  title,
  filter,
  showLabel = false,
}: BoardRendererProps) {
  const {
    image,
    offset,
    components,
    scale,
    rotation,
    flip: { x: flipX, y: flipY },
  } = useAppSelector(selectTopLayer) ?? defaultLayer();
  const containerRef = useRef<HTMLDivElement | null>(null);
  // if we get a list of errors, we will display only components with errors
  const [width, height] = useAppSelector(selectDimension)
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
            <ComponentMarkerLayer scale={scale} flipX={flipX} flipY={flipY} showLable={showLabel} naturalScale={naturalScale} />
          </div>
        </div>
      </div>
    </QuickPinchZoom>
  );
}


// todo add types
function ComponentMarkerLayer({scale, flipX, flipY, showLabel, naturalScale}: any) {

  const componentsIds = useAppSelector(selectLayerComponentsIds);

  const markers = componentsIds.map((c, ix) => {
    let defaultProps = {
      naturalScale: naturalScale,
      componentId: c,
      scale: scale,
      flipX: flipX,
      flipY: flipY,
      showLabel: showLabel,
    };

    return <ComponentMarker color={'#ff0000'} key={ix} {...defaultProps} markerSize={10} />;

  })

  return <>
    {markers}
  </>
}
