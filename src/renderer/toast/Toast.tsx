import { useEffect } from 'react';
import { ToastMessage } from '../../model/ToastMessage';

const ToastShowTime = 2000;

export interface ToastProps {
  toast: ToastMessage;
  onTimeout: () => void;
}
export function Toast({ toast, onTimeout }: ToastProps) {
  useEffect(() => {
    setTimeout(() => {
      onTimeout();
    }, ToastShowTime);
  }, []);
  const { title, message } = toast;
  return (
    <div
      className={'toast show'}
      style={{ position: 'absolute', top: 15, right: 15, zIndex: 99999 }}
    >
      <div className="toast-header">
        <strong className="mr-auto">{title}</strong>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}
