import { array, number, object, SchemaOf, string } from 'yup';
import { Board, Component, Image, Layer, Vector } from './Board';

const vectorSchema: SchemaOf<Vector> = object().shape({
  x: number().required(),
  y: number().required(),
});
const componentSchema: SchemaOf<Component> = object().shape({
  position: vectorSchema,
  id: string().required(),
});
const imageSchema: SchemaOf<Image> = object().shape({
  width: number().required(),
  height: number().required(),
  data: string().required(),
});
const layerSchema: SchemaOf<Layer> = object().shape({
  components: array().of(componentSchema),
  image: imageSchema.nullable(),
  offset: vectorSchema,
  rotation: number().required(),
  scale: vectorSchema,
  flip: vectorSchema,
});
export const boardSchema: SchemaOf<Board> = object().shape({
  layerTop: layerSchema.required(),
  layerBottom: layerSchema.nullable(),
  name: string().required(),
  markerSize: number().required(),
  markerColor: string().required(),
});
