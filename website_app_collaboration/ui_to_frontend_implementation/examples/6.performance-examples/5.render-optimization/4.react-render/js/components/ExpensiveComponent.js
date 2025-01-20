// 模拟耗时计算
const performExpensiveCalculation = (number) => {
    console.log('Performing expensive calculation');
    // 模拟耗时操作
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.random() * number;
    }
    return result;
};

// 未优化的昂贵组件
const UnoptimizedExpensiveComponent = ({ number, onItemClick }) => {
    console.log('UnoptimizedExpensiveComponent rendering');

    // 每次渲染都会重新计算
    const items = Array.from({ length: 50 }, (_, index) => {
        const value = performExpensiveCalculation(number + index);
        return { id: index, value };
    });

    return (
        <div className="expensive-component">
            <h2>未优化的昂贵组件</h2>
            <div className="expensive-content">
                {items.map(item => (
                    <div
                        key={item.id}
                        className="expensive-item"
                        onClick={() => onItemClick(item.id)}
                    >
                        Item {item.id}
                        <br />
                        {item.value.toFixed(2)}
                    </div>
                ))}
            </div>
        </div>
    );
};

// 优化后的昂贵组件
const OptimizedExpensiveComponent = React.memo(({ number, onItemClick }) => {
    console.log('OptimizedExpensiveComponent rendering');

    // 使用useMemo缓存计算结果
    const items = React.useMemo(() => {
        console.log('Computing expensive items');
        return Array.from({ length: 50 }, (_, index) => {
            const value = performExpensiveCalculation(number + index);
            return { id: index, value };
        });
    }, [number]); // 只在number改变时重新计算

    // 优化点击处理函数
    const handleClick = React.useCallback((id) => {
        console.log('Item click handler created');
        onItemClick(id);
    }, [onItemClick]);

    return (
        <div className="expensive-component">
            <h2>优化后的昂贵组件</h2>
            <div className="expensive-content">
                {items.map(item => (
                    <div
                        key={item.id}
                        className="expensive-item"
                        onClick={() => handleClick(item.id)}
                    >
                        Item {item.id}
                        <br />
                        {item.value.toFixed(2)}
                    </div>
                ))}
            </div>
        </div>
    );
}); 