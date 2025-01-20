// 兼容性测试工具类
class CompatibilityTestUtil {
    constructor() {
        this.results = {
            features: [],
            apis: [],
            layouts: []
        };
    }

    // 清除测试结果
    clearResults() {
        this.results = {
            features: [],
            apis: [],
            layouts: []
        };
    }

    // 添加特性测试结果
    addFeatureResult(feature, supported, details = null) {
        this.results.features.push({
            feature,
            supported,
            details
        });
    }

    // 添加API测试结果
    addAPIResult(api, supported, details = null) {
        this.results.apis.push({
            api,
            supported,
            details
        });
    }

    // 添加布局测试结果
    addLayoutResult(layout, supported, details = null) {
        this.results.layouts.push({
            layout,
            supported,
            details
        });
    }

    // 获取测试结果
    getResults() {
        return {
            features: this.results.features,
            apis: this.results.apis,
            layouts: this.results.layouts,
            summary: {
                totalFeatures: this.results.features.length,
                supportedFeatures: this.results.features.filter(f => f.supported).length,
                totalAPIs: this.results.apis.length,
                supportedAPIs: this.results.apis.filter(a => a.supported).length,
                totalLayouts: this.results.layouts.length,
                supportedLayouts: this.results.layouts.filter(l => l.supported).length
            }
        };
    }
}

// 布局兼容性测试类
class LayoutCompatibilityTest {
    constructor(container) {
        this.container = container;
        this.testUtil = new CompatibilityTestUtil();
    }

    // 测试Flexbox支持
    testFlexbox() {
        const testElement = document.createElement('div');
        testElement.style.display = 'flex';
        const isSupported = testElement.style.display === 'flex';
        
        this.testUtil.addLayoutResult(
            'Flexbox',
            isSupported,
            { display: testElement.style.display }
        );

        if (isSupported) {
            // 测试flex属性
            testElement.style.flex = '1';
            const flexSupported = testElement.style.flex === '1';
            this.testUtil.addLayoutResult(
                'Flex Properties',
                flexSupported,
                { flex: testElement.style.flex }
            );

            // 测试flex-direction
            testElement.style.flexDirection = 'column';
            const flexDirectionSupported = testElement.style.flexDirection === 'column';
            this.testUtil.addLayoutResult(
                'Flex Direction',
                flexDirectionSupported,
                { flexDirection: testElement.style.flexDirection }
            );
        }
    }

    // 测试Grid支持
    testGrid() {
        const testElement = document.createElement('div');
        testElement.style.display = 'grid';
        const isSupported = testElement.style.display === 'grid';
        
        this.testUtil.addLayoutResult(
            'Grid',
            isSupported,
            { display: testElement.style.display }
        );

        if (isSupported) {
            // 测试grid-template-columns
            testElement.style.gridTemplateColumns = 'repeat(3, 1fr)';
            const gridTemplateSupported = testElement.style.gridTemplateColumns !== '';
            this.testUtil.addLayoutResult(
                'Grid Template',
                gridTemplateSupported,
                { gridTemplateColumns: testElement.style.gridTemplateColumns }
            );

            // 测试grid-gap
            testElement.style.gap = '10px';
            const gridGapSupported = testElement.style.gap === '10px';
            this.testUtil.addLayoutResult(
                'Grid Gap',
                gridGapSupported,
                { gap: testElement.style.gap }
            );
        }
    }

    // 测试CSS变量支持
    testCSSVariables() {
        const testElement = document.createElement('div');
        testElement.style.setProperty('--test-var', 'red');
        const color = testElement.style.getPropertyValue('--test-var');
        
        this.testUtil.addLayoutResult(
            'CSS Variables',
            color === 'red',
            { supported: color === 'red' }
        );
    }

    // 测试媒体查询支持
    testMediaQueries() {
        const isSupported = window.matchMedia !== undefined;
        this.testUtil.addLayoutResult(
            'Media Queries',
            isSupported,
            { matchMedia: isSupported }
        );

        if (isSupported) {
            // 测试常见媒体查询
            const queries = [
                '(max-width: 768px)',
                '(orientation: portrait)',
                '(prefers-color-scheme: dark)'
            ];

            queries.forEach(query => {
                const mq = window.matchMedia(query);
                this.testUtil.addLayoutResult(
                    `Media Query: ${query}`,
                    true,
                    { matches: mq.matches }
                );
            });
        }
    }

    // 运行所有测试
    runAllTests() {
        this.testUtil.clearResults();
        this.testFlexbox();
        this.testGrid();
        this.testCSSVariables();
        this.testMediaQueries();
        return this.testUtil.getResults();
    }
}

// API兼容性测试类
class APICompatibilityTest {
    constructor() {
        this.testUtil = new CompatibilityTestUtil();
    }

    // 测试现代JavaScript API
    testModernJSAPIs() {
        // 测试Promise
        this.testUtil.addAPIResult(
            'Promise',
            typeof Promise !== 'undefined',
            { type: typeof Promise }
        );

        // 测试Async/Await
        try {
            eval('async function test() {}');
            this.testUtil.addAPIResult(
                'Async/Await',
                true,
                { supported: true }
            );
        } catch (e) {
            this.testUtil.addAPIResult(
                'Async/Await',
                false,
                { error: e.message }
            );
        }

        // 测试Fetch API
        this.testUtil.addAPIResult(
            'Fetch API',
            typeof fetch !== 'undefined',
            { type: typeof fetch }
        );

        // 测试localStorage
        this.testUtil.addAPIResult(
            'localStorage',
            typeof localStorage !== 'undefined',
            { type: typeof localStorage }
        );

        // 测试sessionStorage
        this.testUtil.addAPIResult(
            'sessionStorage',
            typeof sessionStorage !== 'undefined',
            { type: typeof sessionStorage }
        );
    }

    // 测试Web APIs
    testWebAPIs() {
        // 测试Geolocation
        this.testUtil.addAPIResult(
            'Geolocation',
            'geolocation' in navigator,
            { supported: 'geolocation' in navigator }
        );

        // 测试WebSocket
        this.testUtil.addAPIResult(
            'WebSocket',
            typeof WebSocket !== 'undefined',
            { type: typeof WebSocket }
        );

        // 测试requestAnimationFrame
        this.testUtil.addAPIResult(
            'requestAnimationFrame',
            typeof requestAnimationFrame !== 'undefined',
            { type: typeof requestAnimationFrame }
        );

        // 测试Web Workers
        this.testUtil.addAPIResult(
            'Web Workers',
            typeof Worker !== 'undefined',
            { type: typeof Worker }
        );

        // 测试Service Workers
        this.testUtil.addAPIResult(
            'Service Workers',
            'serviceWorker' in navigator,
            { supported: 'serviceWorker' in navigator }
        );
    }

    // 测试DOM APIs
    testDOMAPIs() {
        // 测试querySelector
        this.testUtil.addAPIResult(
            'querySelector',
            typeof document.querySelector !== 'undefined',
            { type: typeof document.querySelector }
        );

        // 测试addEventListener
        this.testUtil.addAPIResult(
            'addEventListener',
            typeof window.addEventListener !== 'undefined',
            { type: typeof window.addEventListener }
        );

        // 测试MutationObserver
        this.testUtil.addAPIResult(
            'MutationObserver',
            typeof MutationObserver !== 'undefined',
            { type: typeof MutationObserver }
        );

        // 测试Intersection Observer
        this.testUtil.addAPIResult(
            'Intersection Observer',
            typeof IntersectionObserver !== 'undefined',
            { type: typeof IntersectionObserver }
        );
    }

    // 运行所有测试
    runAllTests() {
        this.testUtil.clearResults();
        this.testModernJSAPIs();
        this.testWebAPIs();
        this.testDOMAPIs();
        return this.testUtil.getResults();
    }
}

// 特性检测类
class FeatureDetectionTest {
    constructor() {
        this.testUtil = new CompatibilityTestUtil();
    }

    // 测试ES6+特性
    testES6Features() {
        // 测试箭头函数
        try {
            eval('() => {}');
            this.testUtil.addFeatureResult(
                'Arrow Functions',
                true,
                { supported: true }
            );
        } catch (e) {
            this.testUtil.addFeatureResult(
                'Arrow Functions',
                false,
                { error: e.message }
            );
        }

        // 测试解构赋值
        try {
            eval('const { a } = { a: 1 }');
            this.testUtil.addFeatureResult(
                'Destructuring',
                true,
                { supported: true }
            );
        } catch (e) {
            this.testUtil.addFeatureResult(
                'Destructuring',
                false,
                { error: e.message }
            );
        }

        // 测试扩展运算符
        try {
            eval('[...[]];');
            this.testUtil.addFeatureResult(
                'Spread Operator',
                true,
                { supported: true }
            );
        } catch (e) {
            this.testUtil.addFeatureResult(
                'Spread Operator',
                false,
                { error: e.message }
            );
        }
    }

    // 测试CSS特性
    testCSSFeatures() {
        const testElement = document.createElement('div');

        // 测试transform
        testElement.style.transform = 'translateX(0)';
        this.testUtil.addFeatureResult(
            'CSS Transform',
            testElement.style.transform !== '',
            { supported: testElement.style.transform !== '' }
        );

        // 测试transition
        testElement.style.transition = 'all 0.3s';
        this.testUtil.addFeatureResult(
            'CSS Transition',
            testElement.style.transition !== '',
            { supported: testElement.style.transition !== '' }
        );

        // 测试animation
        testElement.style.animation = 'none';
        this.testUtil.addFeatureResult(
            'CSS Animation',
            testElement.style.animation !== '',
            { supported: testElement.style.animation !== '' }
        );
    }

    // 测试HTML5特性
    testHTML5Features() {
        // 测试Canvas
        this.testUtil.addFeatureResult(
            'Canvas',
            !!document.createElement('canvas').getContext,
            { supported: !!document.createElement('canvas').getContext }
        );

        // 测试Video
        const videoElement = document.createElement('video');
        this.testUtil.addFeatureResult(
            'Video',
            !!videoElement.canPlayType,
            { supported: !!videoElement.canPlayType }
        );

        // 测试拖放API
        this.testUtil.addFeatureResult(
            'Drag and Drop',
            'draggable' in document.createElement('div'),
            { supported: 'draggable' in document.createElement('div') }
        );
    }

    // 运行所有测试
    runAllTests() {
        this.testUtil.clearResults();
        this.testES6Features();
        this.testCSSFeatures();
        this.testHTML5Features();
        return this.testUtil.getResults();
    }
}

// 兼容性测试函数
async function runCompatibilityTests() {
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        results: []
    };

    function assert(condition, message, details = null) {
        testResults.total++;
        if (condition) {
            testResults.passed++;
            testResults.results.push({
                status: 'passed',
                message,
                details
            });
        } else {
            testResults.failed++;
            testResults.results.push({
                status: 'failed',
                message,
                details
            });
        }
    }

    console.log('Running Compatibility Tests...');

    try {
        // 测试布局兼容性
        const layoutContainer = document.getElementById('layout-compatibility');
        if (layoutContainer) {
            const layoutTest = new LayoutCompatibilityTest(layoutContainer);
            const layoutResults = layoutTest.runAllTests();

            assert(
                layoutResults.summary.supportedLayouts === layoutResults.summary.totalLayouts,
                'All layouts should be supported',
                layoutResults
            );
        }

        // 测试API兼容性
        const apiTest = new APICompatibilityTest();
        const apiResults = apiTest.runAllTests();

        assert(
            apiResults.summary.supportedAPIs / apiResults.summary.totalAPIs > 0.8,
            'Most APIs should be supported',
            apiResults
        );

        // 测试特性检测
        const featureTest = new FeatureDetectionTest();
        const featureResults = featureTest.runAllTests();

        assert(
            featureResults.summary.supportedFeatures / featureResults.summary.totalFeatures > 0.8,
            'Most features should be supported',
            featureResults
        );

        // 测试浏览器信息
        const browserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints
        };

        assert(
            true,
            'Browser information collected',
            { browserInfo }
        );

        // 测试屏幕信息
        const screenInfo = {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            colorDepth: window.screen.colorDepth,
            orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown'
        };

        assert(
            true,
            'Screen information collected',
            { screenInfo }
        );

    } catch (error) {
        console.error('Compatibility Test Error:', error);
        testResults.results.push({
            status: 'failed',
            message: `Unexpected error: ${error.message}`
        });
    }

    // 输出测试结果
    console.log('Compatibility Test Results:', testResults);
    return testResults;
}

// 在页面加载时运行兼容性测试
document.addEventListener('DOMContentLoaded', async () => {
    const testResults = await runCompatibilityTests();
    
    // 更新UI显示测试结果
    const resultsContainer = document.getElementById('compatibility-test-results');
    if (resultsContainer) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <h3>Compatibility Test Summary</h3>
            <p>Total Tests: ${testResults.total}</p>
            <p>Passed: ${testResults.passed}</p>
            <p>Failed: ${testResults.failed}</p>
        `;
        resultsContainer.appendChild(summary);

        const details = document.createElement('div');
        details.innerHTML = '<h3>Test Details</h3>';
        testResults.results.forEach((result, index) => {
            const resultElement = document.createElement('div');
            resultElement.className = `test-result ${result.status}`;
            let detailsHtml = '';
            if (result.details) {
                detailsHtml = '<div class="details">';
                if (typeof result.details === 'object') {
                    for (const [key, value] of Object.entries(result.details)) {
                        if (key !== 'status' && key !== 'message') {
                            detailsHtml += `<p>${key}: ${
                                typeof value === 'object' ? JSON.stringify(value) : value
                            }</p>`;
                        }
                    }
                }
                detailsHtml += '</div>';
            }
            resultElement.innerHTML = `
                <p>Test #${index + 1}: ${result.status.toUpperCase()}</p>
                <p>${result.message}</p>
                ${detailsHtml}
            `;
            details.appendChild(resultElement);
        });
        resultsContainer.appendChild(details);
    }
}); 