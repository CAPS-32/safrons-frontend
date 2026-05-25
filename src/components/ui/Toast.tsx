import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsShowing(true);
  }, []);

  let containerClass = '';
  let Icon = InformationCircleIcon;
  let iconColor = '';
  let progressClass = '';

  if (type === 'success') {
    containerClass = 'bg-surface border-primary border text-on-surface shadow-primary/10';
    Icon = CheckCircleIcon;
    iconColor = 'text-primary';
    progressClass = 'bg-primary';
  } else if (type === 'error') {
    containerClass = 'bg-surface border-error border text-on-surface shadow-error/10';
    Icon = XCircleIcon;
    iconColor = 'text-error';
    progressClass = 'bg-error';
  } else if (type === 'info') {
    containerClass = 'bg-surface border-tertiary border text-on-surface shadow-tertiary/10';
    Icon = InformationCircleIcon;
    iconColor = 'text-tertiary';
    progressClass = 'bg-tertiary';
  }

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-xl shadow-lg transform transition-all duration-300 ease-out w-full max-w-[20rem] md:max-w-[24rem]
        ${isShowing ? 'translate-x-0 translate-y-0 opacity-100 scale-100' : '-translate-y-4 md:translate-y-0 md:translate-x-4 opacity-0 scale-95'}
        ${containerClass}
      `}
    >
      <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1">
        <h4 className="text-sm font-bold font-display mb-1 text-on-surface">
          {type === 'success' ? 'Berhasil' : type === 'error' ? 'Kesalahan' : 'Informasi'}
        </h4>
        <p className="text-sm font-medium text-on-surface-variant leading-tight">{message}</p>
      </div>
      <button onClick={onClose} className={`shrink-0 hover:bg-surface-dim p-1.5 rounded-full transition-colors ${iconColor}`}>
        <XMarkIcon className="w-5 h-5" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-outline-variant/30">
        <div 
          className={`h-full ${progressClass} transition-all ease-linear`}
          style={{
            width: isShowing ? '0%' : '100%',
            transitionDuration: isShowing ? '3000ms' : '0ms'
          }}
        />
      </div>
    </div>
  );
};

export default Toast;
