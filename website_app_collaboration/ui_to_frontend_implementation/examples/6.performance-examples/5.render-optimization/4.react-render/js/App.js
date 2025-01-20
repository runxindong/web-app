const App = () => {
    const [todos, setTodos] = React.useState([
        { id: 1, text: '学习React优化', completed: false },
        { id: 2, text: '实践性能优化', completed: false },
        { id: 3, text: '编写示例代码', completed: false }
    ]);

    const [number, setNumber] = React.useState(1);
    const [metrics, setMetrics] = React.useState({
        unoptimizedRenders: 0,
        optimizedRenders: 0,
        expensiveCalculations: 0,
        callbackCreations: 0,
        renderTime: 0
    });

    // 更新性能指标
    const updateMetrics = (type) => {
        setMetrics(prev => ({
            ...prev,
            [type]: prev[type] + 1,
            renderTime: performance.now()
        }));
    };

    // Todo切换处理
    const handleToggle = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
        updateMetrics('callbackCreations');
    };

    // 添加新Todo
    const handleAddTodo = () => {
        const newTodo = {
            id: Date.now(),
            text: `新任务 ${todos.length + 1}`,
            completed: false
        };
        setTodos(prev => [...prev, newTodo]);
    };

    // 更新数字
    const handleNumberChange = () => {
        setNumber(prev => prev + 1);
        updateMetrics('expensiveCalculations');
    };

    // 处理项目点击
    const handleItemClick = (id) => {
        console.log(`Clicked item ${id}`);
        updateMetrics('callbackCreations');
    };

    return (
        <div className="container">
            <h1>React渲染优化示例</h1>

            <button onClick={handleAddTodo}>添加任务</button>
            <button onClick={handleNumberChange}>更新数字 ({number})</button>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <UnoptimizedTodoList
                    todos={todos}
                    onToggle={handleToggle}
                />
                <OptimizedTodoList
                    todos={todos}
                    onToggle={handleToggle}
                />
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <UnoptimizedExpensiveComponent
                    number={number}
                    onItemClick={handleItemClick}
                />
                <OptimizedExpensiveComponent
                    number={number}
                    onItemClick={handleItemClick}
                />
            </div>

            <PerformanceMetrics metrics={metrics} />
        </div>
    );
};

// 渲染应用
ReactDOM.render(<App />, document.getElementById('root')); 