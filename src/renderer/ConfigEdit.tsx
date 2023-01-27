import { useForm } from 'react-hook-form';
import { Config, GetSupportedEncoding } from 'model/Config';
import { object, mixed, SchemaOf, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useToast } from './toast/ToastContext';
import { useEffect } from 'react';

export interface ConfigEditProps {
  config: Config;
}

const configSchema: SchemaOf<Config> = object().shape({
  encoding: mixed()
    .required()
    .oneOf(GetSupportedEncoding())
    .transform((val) => val as BufferEncoding),
  watchDir: string().required(),
  extension: string().optional(),
});

export function ConfigEdit({ config }: ConfigEditProps) {
  const navigate = useNavigate();
  const { showMessage } = useToast();
  useEffect(() => {}, []);
  const { handleSubmit, setValue, register } = useForm({
    defaultValues: config,
    resolver: yupResolver(configSchema),
  });

  const onSubmit = (config: Config) => {
    window.electron.configApi.updateConfig(config).then((err) => {
      if (err) {
        // TODO display errors nicer
        window.alert(err.message);
      } else {
        // TODO display errors nicer
        showMessage({
          title: 'Success!',
          message: 'The configuration has been updated',
        });
        navigate('/');
      }
    });
  };

  const handleDirSelect = () => {
    window.electron.fileApi
      .showDirectoryPicker()
      .then((dir) => setValue('watchDir', dir));
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={'card'}>
        <div className={'card-header'}>Options</div>
        <div className={'card-body'}>
          <div className={'row'}>
            <div className={'col-12'}>
              <label className={'form-label'}>Working dir</label>
              <div className={'d-flex'}>
                <input
                  className={'form-control'}
                  type={'text'}
                  readOnly={true}
                  {...register('watchDir')}
                />
                <button className={'btn btn-primary'} onClick={handleDirSelect}>
                  Select
                </button>
              </div>
            </div>
            <div className={'col-12'}>
              <label className={'form-label'}>File encoding</label>
              <div className={'d-flex'}>
                <input
                  className={'form-control'}
                  type={'text'}
                  {...register('encoding')}
                  readOnly={true}
                />
              </div>
            </div>
            <div className={'col-12'}>
              <label className={'form-label'}>File extension</label>
              <div className={'d-flex'}>
                <input
                  className={'form-control'}
                  type={'text'}
                  {...register('extension')}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={'card-footer d-flex justify-content-end'}>
          <button
            onClick={() => navigate('/')}
            type={'button'}
            className={'btn btn-secondary'}
          >
            Cancelar
          </button>
          <button type={'submit'} className={'btn btn-primary'}>
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
