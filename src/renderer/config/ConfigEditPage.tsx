import { useEffect, useState } from 'react';
import { Config } from 'model/Config';
import { ConfigEdit } from 'renderer/config/ConfigEdit';
import { useApiCall } from '../useApiCall';
import { ErrorPage } from '../ErrorPage';

export function ConfigEditPage() {
  const {
    result: config,
    error,
    loading,
  } = useApiCall({
    call: window.electron.configApi.getConfig,
  });
  if (loading) {
    return null;
  }
  if (!config) {
    return <ErrorPage error={error!} />;
  }
  return (
    <div>
      <ConfigEdit config={config} />
    </div>
  );
}
