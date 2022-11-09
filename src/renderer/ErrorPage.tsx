import { useState } from 'react';
import classNames from 'classnames';

export interface ErrorPageProps {
  error: Error;
}

export function ErrorPage({ error }: ErrorPageProps) {
  const [detail, setDetail] = useState(false);
  const toggle = () => {
    setDetail((detail) => !detail);
  };
  return (
    <div>
      <div className={'h2'}>Error: {error.name}</div>
      <div className={'h4'}>Error: {error.message}</div>
      <p>
        <a className="btn btn-primary" onClick={toggle}>
          Show detail
        </a>
      </p>
      <div className={classNames({ collapse: !detail })} id="collapseExample">
        <div className="card card-body pre">{error.stack}</div>
      </div>
    </div>
  );
}
