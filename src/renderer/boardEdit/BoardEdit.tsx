import { FormProvider, useForm } from 'react-hook-form';
import { Board } from '../../model/Board';
import { yupResolver } from '@hookform/resolvers/yup';
import { LayerEdit } from './LayerEdit';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { LayerToggle } from 'renderer/LayerToggle';
import { useNavigate } from 'react-router-dom';
import { boardSchema } from '../../model/schema';

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
  const { register, handleSubmit, watch, formState } = formMethods;
  const [selectedTab, setSelectedTab] = useState<SelectedLayer>('Top');
  useEffect(() => {
    const { isValid } = formState;
    const subscription = watch((value, info) => {
      if (isValid) {
        onChange(value as Board);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, formState]);
  const onSubmit = (board: Board) => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'card vh-100'}>
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
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
