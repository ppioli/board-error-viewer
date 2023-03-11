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
import { useTranslation } from 'react-i18next';
import { ColorPicker } from '../components/ColorPicker';
import { useReduxForm } from '../Test';
import { updateBoardProp } from './boardSlice';
import { useAppSelector } from '../store';

type SelectedLayer = 'Top' | 'Bottom';

export interface BoardFormProps {
}

export function BoardForm() {
  const board = useAppSelector(state => state.board)
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formMethods = useReduxForm<Board>({
    resolver: yupResolver(boardSchema),
    reValidateMode: 'onChange',
    rootSelector: state => state.board.board,
    changeAction: updateBoardProp
  });
  const { register, handleSubmit, reset } = formMethods;
  const [selectedTab, setSelectedTab] = useState<SelectedLayer>('Top');

  const onSubmit = (board: Board) => {
    window.electron.fileApi.boardSave(board).then(({ result: path, error }) => {
      if (error) {
        window.alert('Error ' + error);
      } else {
        navigate('/analysis/' + encodeURIComponent(path!));
      }
    });
  };


  useEffect( () => {
   reset(board as any)
  }, [])

  const onExcelLoad = useCallback((board: Board) => {
    reset(board);
  }, []);
  return (
    <FormProvider {...(formMethods as any)}>
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
            <div className={'row mb-3'}>
              <div className={'col-6'}>
                <label>Marker size</label>
                <input
                  type={'text'}
                  {...register('markerSize', { valueAsNumber: true })}
                  className={'form-control'}
                />
              </div>
              <div className={'col-6'}>
                <label>Marker color</label>
                <ColorPicker name={'markerColor'} />
              </div>
            </div>
            <div className={'row'}>
              <div className={'col-12'}>
                <div
                  className={
                    'border-bottom d-flex justify-content-between mb-3'
                  }
                >
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
              {t('form.save')}...
            </button>
            <button
              className={'btn btn-link'}
              type={'button'}
              onClick={() => navigate('/')}
            >
              {t('form.cancel')}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
