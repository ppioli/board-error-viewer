import { ToastMessage } from '../../model/ToastMessage';
import { createContext, useContext } from 'react';

export interface ToastContextOpts {
  showMessage(toast: ToastMessage): void;
}

export const ToastContext = createContext<ToastContextOpts>(
  {} as ToastContextOpts
);

export function useToast() {
  return useContext(ToastContext);
}
