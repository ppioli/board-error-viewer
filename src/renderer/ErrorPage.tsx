import { useNavigate } from 'react-router-dom';
import { ApiError, ClientError } from '../model/ApiError';
import classNames from 'classnames';
import { isApiError } from '../util/utils';

export interface ErrorPageProps {
  error: ApiError | ClientError;
}

export function ErrorPage({ error }: ErrorPageProps) {
  const navigate = useNavigate();
  const apiError: boolean = isApiError(error);
  return (
    <div
      className={
        'd-flex flex-column justify-content-center align-items-center vh-100'
      }
    >
      <div className={'container text-center'}>
        {isApiError(error) ? (
          <ApiErrorSection error={error} />
        ) : (
          <ClientErrorSection error={error} />
        )}
        <button
          type={'button'}
          className={'btn btn-primary'}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}

function ApiErrorSection({ error }: { error: ApiError }) {
  const { message, stack } = error;
  return (
    <>
      <div>
        <div className={'mb-4'}>
          <i
            className={'display-1 bi-bug'}
          ></i>
        </div>
      </div>
      <h3>The application has encountered an unexpected problem</h3>
      <div className={'card text-start mb-4'}>
        <div className={'card-header'}>Details</div>
        <div className="card-body pre">
          <h5>Message</h5>
          <div>{message}</div>
          {stack && (
            <>
              <hr />
              <h5>Stack</h5>
              <div className={'alert alert-dark mb-0'}>{error.stack}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ClientErrorSection({ error }: { error: ClientError }) {
  const { displayMessage, helpMessage } = error;

  return (
    <>
      <div className={'card text-start mb-4'}>
        <div className={'card-header'}>Details</div>
        <div className="card-body pre">
          <h5>Message</h5>
          <div>{displayMessage}</div>
          <hr />
          <h5>Stack</h5>
          <div className={'alert alert-dark mb-0'}>{stack}</div>
        </div>
      </div>
    </>
  );
}
