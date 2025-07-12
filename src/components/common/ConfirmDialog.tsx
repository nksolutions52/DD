import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-error-600',
          confirmBtn: 'btn-danger'
        };
      case 'warning':
        return {
          icon: 'text-warning-600',
          confirmBtn: 'bg-warning-500 hover:bg-warning-600 text-white'
        };
      default:
        return {
          icon: 'text-primary-600',
          confirmBtn: 'btn-primary'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-1 hover:bg-neutral-100 transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        
        <p className="text-neutral-600 mb-6">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${styles.confirmBtn} w-full sm:w-auto order-1 sm:order-2`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;