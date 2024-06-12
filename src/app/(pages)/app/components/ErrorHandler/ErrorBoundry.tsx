import React, { ReactNode } from "react";

type ErrorBoundaryProps = {
    fallback: ReactNode;
    children : ReactNode;
    onErrorCaught? : (error : any, info : any) => void;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        //console.error("Error caught by ErrorBoundary:", error, info);
        this.props.onErrorCaught?.(error, info);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
