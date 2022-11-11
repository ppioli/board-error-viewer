import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { array, number, boolean, object, SchemaOf, string } from 'yup';
import { Board, Component, Image, Layer, Vector } from '../../model/Board';
import { yupResolver } from '@hookform/resolvers/yup';
import { LayerEdit } from './LayerEdit';
import classNames from 'classnames';
import { useState } from 'react';
import { BoardViewer } from 'renderer/BoardViewer';
import { LayerToggle } from 'renderer/LayerToggle';
import { useNavigate } from 'react-router-dom';

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

const boardSchema: SchemaOf<Board> = object().shape({
  layerTop: layerSchema.required(),
  layerBottom: layerSchema.nullable(),
  name: string().required(),
});

export interface BoardEditProps {
  board: Board;
  path?: string;
}

type SelectedLayer = 'Top' | 'Bottom';

export function BoardEdit({ board, path }: BoardEditProps) {
  const navigate = useNavigate();
  const formMethods = useForm<Board>({
    defaultValues: board,
    resolver: yupResolver(boardSchema),
    reValidateMode: 'onChange',
  });
  const [selectedTab, setSelectedTab] = useState<SelectedLayer>('Top');
  const { register, handleSubmit } = formMethods;

  const onSubmit = (board: Board) => {
    console.log('submitted');
    window.electron.fileApi.boardSave(board).then(({ result: path, error }) => {
      if (error) {
        window.alert('Error ' + error);
      } else {
        navigate('/analysis/' + encodeURIComponent(path!));
      }
    });
  };
  return (
    <FormProvider {...formMethods}>
      <div className={'row'}>
        <div className={'col-3'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={'card vh-100 '}>
              <div className={'card-header h4'}>Edit board</div>
              <div className={'card-body'} style={{ overflowY: 'scroll' }}>
                <div style={{ width: '100%' }}>
                  <div className={'row g-3'}>
                    <div className={'col-12'}>
                      <label>Name</label>
                      <input
                        type={'text'}
                        {...register('name')}
                        className={'form-control'}
                      />
                    </div>
                    <div className={'col-12'}>
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <a
                            className={classNames('nav-link', {
                              active: selectedTab === 'Top',
                            })}
                            aria-current="page"
                            href="renderer/boardEdit/BoardEdit#"
                            onClick={() => setSelectedTab('Top')}
                          >
                            Top
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={classNames('nav-link', {
                              active: selectedTab === 'Bottom',
                            })}
                            aria-current="page"
                            href="renderer/boardEdit/BoardEdit#"
                            onClick={() => setSelectedTab('Bottom')}
                          >
                            Bottom
                          </a>
                        </li>
                      </ul>
                    </div>
                    {selectedTab === 'Top' ? (
                      <LayerEdit name={'layerTop'} />
                    ) : (
                      <>
                        <LayerToggle name={'layerBottom'} />
                      </>
                    )}
                  </div>
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
        <div className={'col-9'}>
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
  // TODO Handle id repetition
  const [showTop, setShowTop] = useState(true);
  const board = watch();
  const { layerTop, layerBottom } = board ?? {};
  console.log(board)
  const show = showTop ? (
    layerTop ? (
      <BoardViewer title={'Layer top'} layer={layerTop} />
    ) : (
      <div>...</div>
    )
  ) : layerBottom ? (
    <BoardViewer title={'Layer bottom'} layer={layerBottom} />
  ) : (
    <div>...</div>
  );
  return (
    <div className={'vh-100'}>
      <div style={{ position: 'relative', zIndex: 10000 }}>
        <button
          className={'btn btn-primary'}
          style={{
            position: 'absolute',
          }}
          onClick={() => setShowTop((s) => !s)}
        >
          Toggle
        </button>
      </div>
      <div className={'h-100'}>{show}</div>
    </div>
  );
}
