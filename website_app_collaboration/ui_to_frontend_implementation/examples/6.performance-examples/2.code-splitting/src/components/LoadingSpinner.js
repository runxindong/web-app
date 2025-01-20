import React from 'react';

function LoadingSpinner() {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-text">加载中... / Loading...</p>
        </div>
    );
}

export default LoadingSpinner; 