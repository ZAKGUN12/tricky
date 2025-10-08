import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  const colors = {
    success: '#00d4aa',
    error: '#e74c3c',
    info: '#3498db'
  };

  return (
    <div className={`toast ${isVisible ? 'show' : 'hide'}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => setIsVisible(false)}>×</button>

      <style jsx>{`
        .toast {
          position: fixed !important;
          top: 20px !important;
          right: 20px !important;
          background: #111 !important;
          border: 2px solid ${colors[type]} !important;
          border-radius: 12px !important;
          padding: 16px 20px !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
          z-index: 10000 !important;
          max-width: 400px !important;
          transition: all 0.3s ease !important;
          margin: 0 !important;
        }

        .toast.show {
          transform: translateX(0) !important;
          opacity: 1 !important;
        }

        .toast.hide {
          transform: translateX(100%) !important;
          opacity: 0 !important;
        }

        .toast-icon {
          font-size: 18px !important;
          flex-shrink: 0 !important;
          margin: 0 !important;
        }

        .toast-message {
          color: #fff !important;
          font-weight: 500 !important;
          flex: 1 !important;
          margin: 0 !important;
        }

        .toast-close {
          background: none !important;
          border: none !important;
          color: #666 !important;
          font-size: 20px !important;
          cursor: pointer !important;
          padding: 0 !important;
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          transition: all 0.2s !important;
          margin: 0 !important;
        }

        .toast-close:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }

        @media (max-width: 768px) {
          .toast {
            left: 20px !important;
            right: 20px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
  }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
}
