// 未优化的TodoList组件
const UnoptimizedTodoList = ({ todos, onToggle }) => {
    console.log('UnoptimizedTodoList rendering');

    // 未优化的过滤函数
    const completedCount = todos.filter(todo => todo.completed).length;
    
    return (
        <div className="todo-list">
            <h2>未优化的Todo列表 (完成: {completedCount})</h2>
            {todos.map(todo => (
                <UnoptimizedTodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                />
            ))}
        </div>
    );
};

// 优化的TodoList组件
const OptimizedTodoList = ({ todos, onToggle }) => {
    console.log('OptimizedTodoList rendering');

    // 使用useMemo优化计算
    const completedCount = React.useMemo(() => {
        console.log('Computing completed count');
        return todos.filter(todo => todo.completed).length;
    }, [todos]);

    // 使用useCallback优化回调函数
    const handleToggle = React.useCallback((id) => {
        console.log('Toggle callback created');
        onToggle(id);
    }, [onToggle]);

    return (
        <div className="todo-list">
            <h2>优化后的Todo列表 (完成: {completedCount})</h2>
            {todos.map(todo => (
                <OptimizedTodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                />
            ))}
        </div>
    );
}; 