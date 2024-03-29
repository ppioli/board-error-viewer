import { useForm } from 'react-hook-form';
import {
  Config,
  GetSupportedEncoding,
  supportedLanguagesLabels,
  supportedLanguagesValues,
} from 'model/Config';
import { mixed, object, SchemaOf, string, boolean } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../toast/ToastContext';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  language: mixed().oneOf(supportedLanguagesValues()).optional(),
  persistent: boolean().optional(),
});

export function ConfigEdit({ config }: ConfigEditProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showMessage } = useToast();
  useEffect(() => {}, []);
  const { handleSubmit, setValue, register, watch } = useForm({
    defaultValues: config,
    resolver: yupResolver(configSchema),
  });
  watch((data, { name, type }) => {
    if(type === 'change' && name === 'language'){
      i18n.changeLanguage(data['language'])
    }
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
              <label className={'form-label'}>
                {t('configEdit.workingDir')}
              </label>
              <div className={'d-flex'}>
                <input
                  className={'form-control'}
                  type={'text'}
                  readOnly={true}
                  {...register('watchDir')}
                />
                <button
                  className={'btn btn-primary'}
                  type={'button'}
                  onClick={handleDirSelect}
                >
                  {t('form.select')}
                </button>
              </div>
            </div>
            <div className={'col-12'}>
              <label className={'form-label'}>
                {t('configEdit.fileEncoding')}
              </label>
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
              <label className={'form-label'}>
                {t('configEdit.fileExtension')}
              </label>
              <div className={'d-flex'}>
                <input
                  className={'form-control'}
                  type={'text'}
                  {...register('extension')}
                />
              </div>
            </div>
            <div className={'col-12'}>
              <div className={'d-flex'}>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    {...register('persistent')}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    Persistent
                  </label>
                </div>
              </div>
            </div>
            <div className={'col-12'}>
              <label className={'form-label'}>{t('configEdit.language')}</label>
              <div className={'d-flex'}>
                <select className={'form-control'} {...register('language')}>
                  {supportedLanguagesValues().map((v) => (
                    <option value={v}>{supportedLanguagesLabels(v)}</option>
                  ))}
                </select>
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
            {t('form.cancel')}
          </button>
          <button type={'submit'} className={'btn btn-primary'}>
            {t('form.save')}
          </button>
        </div>
      </div>
    </form>
  );
}
