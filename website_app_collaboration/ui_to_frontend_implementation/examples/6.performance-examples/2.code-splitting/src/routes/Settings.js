import React, { useState } from 'react';

// 动态导入组件 / Dynamically import components
const PreloadSettings = React.lazy(() => import('../components/PreloadSettings'));
const CacheSettings = React.lazy(() => import('../components/CacheSettings'));
const BundleSettings = React.lazy(() => import('../components/BundleSettings'));

function Settings() {
    const [settings, setSettings] = useState({
        preload: {
            enabled: true,
            threshold: 3000,
            priority: 'low'
        },
        cache: {
            enabled: true,
            maxAge: 86400,
            strategy: 'network-first'
        },
        bundle: {
            minChunkSize: 20000,
            maxChunkSize: 70000,
            automaticPrefetch: true
        }
    });

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const saveSettings = async () => {
        try {
            // 模拟保存设置 / Simulate saving settings
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('设置已保存 / Settings saved');
        } catch (error) {
            console.error('保存设置失败 / Failed to save settings:', error);
            alert('保存失败 / Save failed');
        }
    };

    return (
        <div className="settings">
            <header className="settings-header">
                <h1>性能优化设置 / Performance Optimization Settings</h1>
                <p>
                    配置代码分割和性能优化选项
                    Configure code splitting and performance optimization options
                </p>
            </header>

            <main className="settings-content">
                <section className="preload-settings">
                    <h2>预加载设置 / Preload Settings</h2>
                    <React.Suspense fallback={<div>加载中... / Loading...</div>}>
                        <PreloadSettings
                            settings={settings.preload}
                            onChange={(key, value) => handleSettingChange('preload', key, value)}
                        />
                    </React.Suspense>
                </section>

                <section className="cache-settings">
                    <h2>缓存设置 / Cache Settings</h2>
                    <React.Suspense fallback={<div>加载中... / Loading...</div>}>
                        <CacheSettings
                            settings={settings.cache}
                            onChange={(key, value) => handleSettingChange('cache', key, value)}
                        />
                    </React.Suspense>
                </section>

                <section className="bundle-settings">
                    <h2>打包设置 / Bundle Settings</h2>
                    <React.Suspense fallback={<div>加载中... / Loading...</div>}>
                        <BundleSettings
                            settings={settings.bundle}
                            onChange={(key, value) => handleSettingChange('bundle', key, value)}
                        />
                    </React.Suspense>
                </section>

                <section className="current-settings">
                    <h2>当前配置 / Current Configuration</h2>
                    <div className="settings-summary">
                        <div className="settings-group">
                            <h3>预加载 / Preload</h3>
                            <ul>
                                <li>
                                    状态 / Status: {settings.preload.enabled ? '启用 / Enabled' : '禁用 / Disabled'}
                                </li>
                                <li>
                                    阈值 / Threshold: {settings.preload.threshold}ms
                                </li>
                                <li>
                                    优先级 / Priority: {settings.preload.priority}
                                </li>
                            </ul>
                        </div>

                        <div className="settings-group">
                            <h3>缓存 / Cache</h3>
                            <ul>
                                <li>
                                    状态 / Status: {settings.cache.enabled ? '启用 / Enabled' : '禁用 / Disabled'}
                                </li>
                                <li>
                                    最大期限 / Max Age: {settings.cache.maxAge}s
                                </li>
                                <li>
                                    策略 / Strategy: {settings.cache.strategy}
                                </li>
                            </ul>
                        </div>

                        <div className="settings-group">
                            <h3>打包 / Bundle</h3>
                            <ul>
                                <li>
                                    最小块大小 / Min Chunk Size: {settings.bundle.minChunkSize} bytes
                                </li>
                                <li>
                                    最大块大小 / Max Chunk Size: {settings.bundle.maxChunkSize} bytes
                                </li>
                                <li>
                                    自动预取 / Auto Prefetch: {
                                        settings.bundle.automaticPrefetch ? '启用 / Enabled' : '禁用 / Disabled'
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <div className="settings-actions">
                    <button 
                        className="save-button"
                        onClick={saveSettings}
                    >
                        保存设置 / Save Settings
                    </button>
                    <button 
                        className="reset-button"
                        onClick={() => window.location.reload()}
                    >
                        重置 / Reset
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Settings; 