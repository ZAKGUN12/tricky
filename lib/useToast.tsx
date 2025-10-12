import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ToastContainer = () => {
    if (toasts.length === 0) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              minWidth: '300px',
              borderLeft: `4px solid ${
                toast.type === 'success' ? '#10b981' : 
                toast.type === 'error' ? '#ef4444' : '#3b82f6'
              }`
            }}
          >
            <span>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return { showToast, ToastContainer };
}
