import React from 'react';

function BundleSettings({ settings, onChange }) {
    const { minChunkSize, maxChunkSize, automaticPrefetch } = settings;

    const handleMinSizeChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= maxChunkSize) {
            onChange('minChunkSize', value);
        }
    };

    const handleMaxSizeChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= minChunkSize) {
            onChange('maxChunkSize', value);
        }
    };

    const handlePrefetchToggle = () => {
        onChange('automaticPrefetch', !automaticPrefetch);
    };

    const getSizeRecommendation = (size) => {
        if (size < 20000) return '太小 / Too small';
        if (size > 100000) return '太大 / Too large';
        return '适中 / Appropriate';
    };

    return (
        <div className="bundle-settings">
            <div className="settings-group">
                <label className="setting-label">
                    <span className="label-text">
                        最小块大小 (bytes)
                        Minimum Chunk Size (bytes)
                    </span>
                    <input
                        type="number"
                        value={minChunkSize}
                        onChange={handleMinSizeChange}
                        min="0"
                        step="1000"
                        className="number-input"
                    />
                </label>
                <p className="setting-description">
                    {getSizeRecommendation(minChunkSize)}
                </p>
            </div>

            <div className="settings-group">
                <label className="setting-label">
                    <span className="label-text">
                        最大块大小 (bytes)
                        Maximum Chunk Size (bytes)
                    </span>
                    <input
                        type="number"
                        value={maxChunkSize}
                        onChange={handleMaxSizeChange}
                        min={minChunkSize}
                        step="1000"
                        className="number-input"
                    />
                </label>
                <p className="setting-description">
                    {getSizeRecommendation(maxChunkSize)}
                </p>
            </div>

            <div className="settings-group">
                <label className="setting-label">
                    <span className="label-text">
                        自动预取
                        Automatic Prefetch
                    </span>
                    <input
                        type="checkbox"
                        checked={automaticPrefetch}
                        onChange={handlePrefetchToggle}
                        className="toggle-input"
                    />
                </label>
                <p className="setting-description">
                    在空闲时自动预取可能需要的块
                    Automatically prefetch potentially needed chunks during idle time
                </p>
            </div>

            <div className="size-visualization">
                <h4>大小可视化 / Size Visualization</h4>
                <div className="size-bar">
                    <div 
                        className="min-size"
                        style={{ left: `${(minChunkSize / maxChunkSize) * 100}%` }}
                    >
                        Min: {minChunkSize}
                    </div>
                    <div 
                        className="max-size"
                        style={{ right: '0' }}
                    >
                        Max: {maxChunkSize}
                    </div>
                    <div 
                        className="optimal-range"
                        style={{
                            left: `${(20000 / maxChunkSize) * 100}%`,
                            right: `${100 - (100000 / maxChunkSize) * 100}%`
                        }}
                    >
                        最佳范围 / Optimal Range
                    </div>
                </div>
            </div>

            <div className="settings-info">
                <h4>当前配置 / Current Configuration</h4>
                <ul>
                    <li>
                        最小大小 / Min Size: {minChunkSize} bytes
                    </li>
                    <li>
                        最大大小 / Max Size: {maxChunkSize} bytes
                    </li>
                    <li>
                        自动预取 / Auto Prefetch:{' '}
                        <span className={automaticPrefetch ? 'enabled' : 'disabled'}>
                            {automaticPrefetch ? '启用 / Enabled' : '禁用 / Disabled'}
                        </span>
                    </li>
                </ul>
            </div>

            <div className="settings-tips">
                <h4>配置建议 / Configuration Tips</h4>
                <ul>
                    <li>
                        最小块大小建议 20KB 以上
                        Minimum chunk size recommended above 20KB
                    </li>
                    <li>
                        最大块大小建议不超过 100KB
                        Maximum chunk size recommended below 100KB
                    </li>
                    <li>
                        移动端建议关闭自动预取
                        Consider disabling auto prefetch on mobile
                    </li>
                </ul>
            </div>

            <div className="optimization-status">
                <h4>优化状态 / Optimization Status</h4>
                <div className={`status-indicator ${
                    minChunkSize >= 20000 && maxChunkSize <= 100000 ? 'good' : 'warning'
                }`}>
                    {minChunkSize >= 20000 && maxChunkSize <= 100000 ? (
                        <span>
                            配置合理 / Configuration Optimal
                        </span>
                    ) : (
                        <span>
                            需要优化 / Needs Optimization
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BundleSettings; 