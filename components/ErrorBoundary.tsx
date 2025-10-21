import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🚨 Something went wrong</h2>
            <p>We&apos;re sorry, but something unexpected happened.</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="retry-btn"
            >
              🔄 Try Again
            </button>
          </div>
          
          <style jsx>{`
            .error-boundary {
              min-height: 50vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
            }
            
            .error-content {
              text-align: center;
              background: rgba(15, 15, 35, 0.8);
              backdrop-filter: blur(20px);
              border: 2px solid rgba(255, 119, 198, 0.3);
              border-radius: 16px;
              padding: 2rem;
              color: white;
            }
            
            .retry-btn {
              background: rgba(120, 119, 198, 0.8);
              border: none;
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              cursor: pointer;
              margin-top: 1rem;
              transition: all 0.2s ease;
            }
            
            .retry-btn:hover {
              background: rgba(120, 119, 198, 1);
              transform: scale(1.05);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
