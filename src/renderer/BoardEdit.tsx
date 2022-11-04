import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { array, number, object, SchemaOf, string } from 'yup';
import { Board, Component, Image, Layer, Vector } from '../model/Board';
import { yupResolver } from '@hookform/resolvers/yup';
import { LayerEdit } from './LayerEdit';
import { BoardViewer } from './BoardViewer';
import classNames from 'classnames';

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
  scale: vectorSchema,
});

const boardSchema: SchemaOf<Board> = object().shape({
  layerTop: layerSchema.required(),
  layerBottom: layerSchema.nullable(),
  name: string().required(),
});

export interface BoardEditProps {
  board: Board;
  path?: string;
}

export function BoardEdit({ board, path }: BoardEditProps) {
  const formMethods = useForm<Board>({
    defaultValues: board,
    resolver: yupResolver(boardSchema),
    reValidateMode: 'onChange',
  });

  const { register, handleSubmit, formState } = formMethods;
  const onSubmit = (board: Board) => {
    console.log('submitted');
    window.electron.fileApi.boardSave(board);
  };
  const { errors } = formState;
  return (
    <FormProvider {...formMethods}>
      <div className={'row'}>
        <div className={'col-6'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={'card vh-100'}>
              <div className={'card-header h4'}>Edit board</div>
              <div className={'card-body'}>
                <div style={{ width: '100%' }}>
                  <div className={'row'}>
                    <div className={'col-12'}></div>
                    <div className={'col-12 form-group'}>
                      <label>Name</label>
                      <input
                        type={'text'}
                        {...register('name')}
                        className={'form-control'}
                      />
                    </div>
                  </div>
                  <hr />
                  <h4>Top layer</h4>
                  <LayerEdit name={'layerTop'} />
                </div>
              </div>
              <div className="card-footer flex-row-reverse flex">
                <button className={'btn btn-primary'} type={'submit'}>
                  Save...
                </button>
                <button
                  className={classNames('btn btn-primary', {
                    'd-none': path,
                  })}
                  type={'submit'}
                >
                  Save As...
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className={'col-6'}>
          <BoardPreview />
        </div>
      </div>
    </FormProvider>
  );
}

function BoardPreview() {
  const {
    formState: { isValid },
    watch,
  } = useFormContext();

  const board = watch();
  const { layerTop, layerBottom } = board ?? {};
  console.log(layerTop);
  return (
    <div className={'vh-100'}>
      <div className={'h-50'}>
        {layerTop ? <BoardViewer title={'Layer top'} layer={layerTop} /> : <div>...</div>}
      </div>
      <div className={'h-50'}>
        {layerBottom ? <BoardViewer title={'Layer bottom'} layer={layerTop} /> : <div>...</div>}
      </div>
    </div>
  );
}
