import React from 'react';

function PreloadSettings({ settings, onChange }) {
    const { enabled, threshold, priority } = settings;

    const handleToggle = () => {
        onChange('enabled', !enabled);
    };

    const handleThresholdChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0) {
            onChange('threshold', value);
        }
    };

    const handlePriorityChange = (e) => {
        onChange('priority', e.target.value);
    };

    return (
        <div className="preload-settings">
            <div className="settings-group">
                <label className="setting-label">
                    <span className="label-text">
                        启用预加载
                        Enable Preloading
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
                        预加载阈值 (ms)
                        Preload Threshold (ms)
                    </span>
                    <input
                        type="number"
                        value={threshold}
                        onChange={handleThresholdChange}
                        min="0"
                        step="100"
                        disabled={!enabled}
                        className="number-input"
                    />
                </label>
                <p className="setting-description">
                    空闲时间超过此阈值时触发预加载
                    Trigger preloading when idle time exceeds this threshold
                </p>
            </div>

            <div className="settings-group">
                <label className="setting-label">
                    <span className="label-text">
                        预加载优先级
                        Preload Priority
                    </span>
                    <select
                        value={priority}
                        onChange={handlePriorityChange}
                        disabled={!enabled}
                        className="select-input"
                    >
                        <option value="low">
                            低 / Low
                        </option>
                        <option value="medium">
                            中 / Medium
                        </option>
                        <option value="high">
                            高 / High
                        </option>
                    </select>
                </label>
                <p className="setting-description">
                    设置预加载任务的优先级
                    Set the priority of preloading tasks
                </p>
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
                        阈值 / Threshold: {threshold}ms
                    </li>
                    <li>
                        优先级 / Priority: {priority}
                    </li>
                </ul>
            </div>

            <div className="settings-tips">
                <h4>配置建议 / Configuration Tips</h4>
                <ul>
                    <li>
                        建议阈值设置在 2000-5000ms 之间
                        Recommended threshold between 2000-5000ms
                    </li>
                    <li>
                        移动设备建议使用较高阈值
                        Higher threshold recommended for mobile devices
                    </li>
                    <li>
                        网络较差时建议降低优先级
                        Lower priority recommended for poor network conditions
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PreloadSettings; 