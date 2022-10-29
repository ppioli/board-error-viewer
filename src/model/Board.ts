

export interface Board {
  name: string;
  layerTop: Layer;
  layerBottom: Layer | null;
}

export interface Layer {
  image: string;
  offset: Vector;
  scale: Vector;
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

export const defaultVector: Vector = { x: 0, y: 0}

export const defaultBoard: Board = {
  name: "",
  layerTop: {
    components: [],
    image: "",
    scale: defaultVector,
    offset: defaultVector,
  },
  layerBottom: null,
}

export const defaultComponent: Component = {
  position: defaultVector,
  id: ""
}
