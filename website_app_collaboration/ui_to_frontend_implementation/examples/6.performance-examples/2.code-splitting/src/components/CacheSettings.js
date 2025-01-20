import React from 'react';

function CacheSettings({ settings, onChange }) {
    const { enabled, maxAge, strategy } = settings;

    const handleToggle = () => {
        onChange('enabled', !enabled);
    };

    const handleMaxAgeChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0) {
            onChange('maxAge', value);
        }
    };

    const handleStrategyChange = (e) => {
        onChange('strategy', e.target.value);
    };

    const strategies = [
        {
            value: 'network-first',
            label: '网络优先 / Network First',
            description: '优先使用网络请求，失败时使用缓存 / Try network first, fallback to cache'
        },
        {
            value: 'cache-first',
            label: '缓存优先 / Cache First',
            description: '优先使用缓存，失败时请求网络 / Try cache first, fallback to network'
        },
        {
            value: 'stale-while-revalidate',
            label: '后台更新 / Stale While Revalidate',
            description: '使用缓存同时在后台更新 / Use cache while updating in background'
        }
    ];

    return (
        <div className="cache-settings">
            <div className="settings-group">
                <label className="setting-label">
                    <span className="label-text">
                        启用缓存
                        Enable Caching
                    </span>
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={handleToggle}
                        className="toggle-input"
                    />
                </label>
            </div>

            <div className="settings-group">
                <label className="setting-label">
                    <span className="label-text">
                        最大缓存时间 (秒)
                        Maximum Cache Age (seconds)
                    </span>
                    <input
                        type="number"
                        value={maxAge}
                        onChange={handleMaxAgeChange}
                        min="0"
                        step="3600"
                        disabled={!enabled}
                        className="number-input"
                    />
                </label>
                <p className="setting-description">
                    缓存过期时间，0表示不过期
                    Cache expiration time, 0 means no expiration
                </p>
            </div>

            <div className="settings-group">
                <label className="setting-label">
                    <span className="label-text">
                        缓存策略
                        Cache Strategy
                    </span>
                    <select
                        value={strategy}
                        onChange={handleStrategyChange}
                        disabled={!enabled}
                        className="select-input"
                    >
                        {strategies.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="strategy-description">
                <h4>策略说明 / Strategy Description</h4>
                {strategies.map(({ value, label, description }) => (
                    <div 
                        key={value} 
                        className={`strategy-item ${strategy === value ? 'active' : ''}`}
                    >
                        <h5>{label}</h5>
                        <p>{description}</p>
                    </div>
                ))}
            </div>

            <div className="settings-info">
                <h4>当前配置 / Current Configuration</h4>
                <ul>
                    <li>
                        状态 / Status:{' '}
                        <span className={enabled ? 'enabled' : 'disabled'}>
                            {enabled ? '启用 / Enabled' : '禁用 / Disabled'}
                        </span>
                    </li>
                    <li>
                        最大时间 / Max Age: {maxAge} 秒 / seconds
                    </li>
                    <li>
                        策略 / Strategy: {
                            strategies.find(s => s.value === strategy)?.label
                        }
                    </li>
                </ul>
            </div>

            <div className="settings-tips">
                <h4>配置建议 / Configuration Tips</h4>
                <ul>
                    <li>
                        静态资源建议使用缓存优先策略
                        Cache-first strategy recommended for static assets
                    </li>
                    <li>
                        API请求建议使用网络优先策略
                        Network-first strategy recommended for API requests
                    </li>
                    <li>
                        频繁更新的内容建议使用后台更新策略
                        Stale-while-revalidate recommended for frequently updated content
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default CacheSettings; 