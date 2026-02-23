import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Something went wrong</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Reload Page
                    </button>
                    <details style={{ marginTop: '2rem', maxWidth: '600px' }}>
                        <summary style={{ cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                            Technical Details
                        </summary>
                        <pre style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--border-radius-sm)',
                            overflow: 'auto',
                            textAlign: 'left',
                            fontSize: '0.875rem'
                        }}>
                            {this.state.error?.stack}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
