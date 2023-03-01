export interface Board {
  name: string;
  layerTop: Layer;
  layerBottom: Layer | null;
  markerSize: number;
  markerColor: string;
}

export interface Image {
  width: number;
  height: number;
  data: string;
}

export interface Layer {
  image: Image | null;
  offset: Vector;
  scale: Vector;
  flip: Vector;
  rotation: number;
  components: Component[];
}

export interface Component {
  id: string;
  position: Vector;
}

export interface Vector {
  x: number;
  y: number;
}

export const defaultVector: () => Vector = () => ({ x: 0, y: 0 });
export const defaultLayer: () => Layer = () => ({
  components: [],
  image: null,
  scale: { x: 1, y: 1 },
  flip: { x: 1, y: 1 },
  rotation: 0,
  offset: defaultVector(),
});
export const defaultBoard: () => Board = () => ({
  name: '',
  layerBottom: null,
  layerTop: defaultLayer(),
  markerColor: '#ff0000',
  markerSize: 10,
});

export const defaultComponent: () => Component = () => ({
  position: defaultVector(),
  id: '',
});
