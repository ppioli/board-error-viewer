import { ToastMessage } from '../../model/ToastMessage';
import { createContext, useContext } from 'react';
import { ApiError, ClientError } from '../../model/ApiError';

export interface ToastContextOpts {
  showMessage(toast: ToastMessage): void;
  showError( error: ApiError | ClientError): void;
}

export const ToastContext = createContext<ToastContextOpts>(
  {} as ToastContextOpts
);

export function useToast() {
  return useContext(ToastContext);
}
