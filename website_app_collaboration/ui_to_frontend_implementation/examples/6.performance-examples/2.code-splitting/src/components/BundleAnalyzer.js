import React from 'react';

function BundleAnalyzer({ data }) {
    const { total, chunks } = data;

    const getChunkSizePercentage = (size) => {
        const totalSize = parseInt(total);
        const chunkSize = parseInt(size);
        return (chunkSize / totalSize) * 100;
    };

    const getSizeColor = (size) => {
        const sizeInKB = parseInt(size) / 1024;
        if (sizeInKB < 50) return 'success';
        if (sizeInKB < 200) return 'warning';
        return 'danger';
    };

    return (
        <div className="bundle-analyzer">
            <div className="analyzer-header">
                <h3>包分析 / Bundle Analysis</h3>
                <p className="total-size">
                    总大小 / Total Size: <span>{total}</span>
                </p>
            </div>

            <div className="chunks-visualization">
                <div className="chunks-grid">
                    {chunks.map((chunk, index) => (
                        <div 
                            key={index}
                            className={`chunk-item ${getSizeColor(chunk.size)}`}
                            style={{ 
                                flexGrow: getChunkSizePercentage(chunk.size)
                            }}
                        >
                            <div className="chunk-info">
                                <h4>{chunk.name}</h4>
                                <p>{chunk.size}</p>
                                <p className="percentage">
                                    {getChunkSizePercentage(chunk.size).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="optimization-suggestions">
                <h4>优化建议 / Optimization Suggestions</h4>
                <ul>
                    {chunks.map((chunk, index) => {
                        const sizeInKB = parseInt(chunk.size) / 1024;
                        return (
                            <li key={index} className={getSizeColor(chunk.size)}>
                                <strong>{chunk.name}:</strong>
                                {sizeInKB > 200 ? (
                                    <span>
                                        建议拆分，当前大小过大
                                        Consider splitting, current size too large
                                    </span>
                                ) : sizeInKB > 50 ? (
                                    <span>
                                        考虑优化，大小适中
                                        Consider optimization, size moderate
                                    </span>
                                ) : (
                                    <span>
                                        大小合适，无需优化
                                        Size appropriate, no optimization needed
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="analyzer-tips">
                <h4>分析提示 / Analysis Tips</h4>
                <ul>
                    <li>
                        建议单个块大小不超过 200KB
                        Recommended chunk size should not exceed 200KB
                    </li>
                    <li>
                        注意检查重复依赖
                        Check for duplicate dependencies
                    </li>
                    <li>
                        考虑使用动态导入优化大块
                        Consider using dynamic imports for large chunks
                    </li>
                </ul>
            </div>

            <div className="legend">
                <div className="legend-item success">
                    <span className="legend-color"></span>
                    <span>适中 / Good (&lt; 50KB)</span>
                </div>
                <div className="legend-item warning">
                    <span className="legend-color"></span>
                    <span>警告 / Warning (50KB - 200KB)</span>
                </div>
                <div className="legend-item danger">
                    <span className="legend-color"></span>
                    <span>过大 / Too Large (&gt; 200KB)</span>
                </div>
            </div>
        </div>
    );
}

export default BundleAnalyzer; 