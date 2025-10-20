'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: new Error('') });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ maxWidth: 500, width: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                            <Typography variant="h5" component="h2" gutterBottom>
                                Something went wrong
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Refresh />}
                                onClick={this.handleRetry}
                                color="primary"
                            >
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
