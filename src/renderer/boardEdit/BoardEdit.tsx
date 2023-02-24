import { FormProvider, useForm } from 'react-hook-form';
import { Board } from '../../model/Board';
import { yupResolver } from '@hookform/resolvers/yup';
import { LayerEdit } from './LayerEdit';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { LayerToggle } from 'renderer/components/boardRenderer/LayerToggle';
import { useNavigate } from 'react-router-dom';
import { boardSchema } from '../../model/schema';
import { ExcelImporter } from './ExcelImporter';

type SelectedLayer = 'Top' | 'Bottom';

export interface BoardFormProps {
  board: Board;
  onChange: (board: Board) => void;
}

export function BoardForm({ board, onChange }: BoardFormProps) {
  const navigate = useNavigate();
  const formMethods = useForm<Board>({
    defaultValues: board,
    resolver: yupResolver(boardSchema),
    reValidateMode: 'onChange',
  });
  const { register, handleSubmit, watch, reset } = formMethods;
  const [selectedTab, setSelectedTab] = useState<SelectedLayer>('Top');
  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        onChange(value as Board);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (board: Board) => {
    window.electron.fileApi.boardSave(board).then(({ result: path, error }) => {
      if (error) {
        window.alert('Error ' + error);
      } else {
        navigate('/analysis/' + encodeURIComponent(path!));
      }
    });
  };

  const onExcelLoad = useCallback((board: Board) => {
    reset(board);
  }, []);
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'card vh-100'}>
          <div className={'card-body d-flex flex-column'}>
            <div className={'row mb-3'}>
              <div className={'col-12'}>
                <label>Name</label>
                <input
                  type={'text'}
                  {...register('name')}
                  className={'form-control'}
                />
              </div>
            </div>
            <div className={'row'}>
              <div className={'col-12'}>
                <div className={'border-bottom d-flex justify-content-between mb-3'}>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <button
                        className={classNames('nav-link', {
                          active: selectedTab === 'Top',
                        })}
                        type={'button'}
                        onClick={() => setSelectedTab('Top')}
                      >
                        Top
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={classNames('nav-link', {
                          active: selectedTab === 'Bottom',
                        })}
                        type={'button'}
                        onClick={() => setSelectedTab('Bottom')}
                      >
                        Bottom
                      </button>
                    </li>
                  </ul>
                  <ExcelImporter onLoad={onExcelLoad} />
                </div>
              </div>
            </div>
            <div className={'row flex-fill'}>
              <div className={'col-12'}>
                {selectedTab === 'Top' ? (
                  <LayerEdit name={'layerTop'} />
                ) : (
                  <LayerToggle name={'layerBottom'} />
                )}
              </div>
            </div>
          </div>
          <div className="card-footer flex-row-reverse d-flex">
            <button className={'btn btn-primary'} type={'submit'}>
              Save...
            </button>
            <button
              className={'btn btn-link'}
              type={'button'}
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
