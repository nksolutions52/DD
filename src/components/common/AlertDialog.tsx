import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  actionText?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose,
  actionText = 'OK'
}) => {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-success-600',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200'
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-error-600',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-warning-600',
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200'
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-primary-600',
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200'
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`rounded-full p-2 ${config.bgColor} ${config.borderColor} border`}>
              <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-neutral-100 transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        
        <p className="text-neutral-600 mb-6 pl-11">{message}</p>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-primary w-full sm:w-auto"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;