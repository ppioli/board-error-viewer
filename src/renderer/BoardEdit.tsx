import { FormProvider, useForm } from 'react-hook-form';
import { array, number, object, SchemaOf, string } from 'yup';
import { Board, Component, defaultBoard, Layer, Vector } from '../model/Board';
import { yupResolver } from '@hookform/resolvers/yup';
import { LayerEdit } from './LayerEdit';
import { BoardViewer } from './BoardViewer';
import { useState } from 'react';

const vectorSchema: SchemaOf<Vector> = object().shape({
  x: number().required(),
  y: number().required(),
});

const componentSchema: SchemaOf<Component> = object().shape({
  position: vectorSchema,
  id: string().required(),
});

const layerSchema: SchemaOf<Layer> = object().shape({
  components: array().of(componentSchema),
  image: string().required(),
  offset: vectorSchema,
  scale: vectorSchema,
});

const boardSchema: SchemaOf<Board> = object().shape({
  layerTop: layerSchema.required(),
  layerBottom: layerSchema.nullable(),
  name: string().required(),
});

export function BoardEdit() {
  const formMethods = useForm<Board>({
    defaultValues: defaultBoard,
    resolver: yupResolver(boardSchema),
  });

  const [board, setBoard] = useState(defaultBoard)

  const { register, handleSubmit, formState} = formMethods;
  const onSubmit = (board: Board) => setBoard(board);
  const {errors} = formState;
  return <div className={"row"}>
    <div className={"col-6"}>
    <FormProvider {...formMethods}>
      <div style={{ width: '100%' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Edit board</h1>
          <h2>Name</h2>
          <input type={'text'} {...register('name')} />
          <h2>Top Layer</h2>
          <LayerEdit name={'layerTop'} />
          <button className={'btn btn-primary'} type={'submit'}>
            Save
          </button>
          <button className={'btn btn-primary'} type={'button'} onClick={() => console.log(errors)}>
            Errors
          </button>
        </form>
      </div>
    </FormProvider>
    </div>
    <div className={"col-6"}>
      <BoardViewer board={board}/>
    </div>
  </div>;
}
