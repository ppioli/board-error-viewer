import { ReactNode, useCallback, useMemo, useState } from 'react';
import { ToastMessage } from '../../model/ToastMessage';
import { Toast } from './Toast';
import { ToastContext, ToastContextOpts } from './ToastContext';

export interface ToastContainerProps {
  children: ReactNode;
}
export function ToastContextProvider({ children }: ToastContainerProps) {
  // We will only allow one toast at a time
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const remove = useCallback(() => {
    setToast(null);
  }, []);
  const toastContextValue = useMemo(() => {
    return {
      showMessage: (message: ToastMessage) => {
        setToast(message);
      },
    } as ToastContextOpts;
  }, []);
  return (
    <ToastContext.Provider value={toastContextValue}>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'relative', minHeight: '200px', width: '100%' }}
      >
        {toast && <Toast toast={toast} onTimeout={remove} />}
        {children}
      </div>
    </ToastContext.Provider>
  );
}
