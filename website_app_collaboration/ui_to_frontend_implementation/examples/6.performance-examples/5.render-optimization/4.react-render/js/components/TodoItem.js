// 未优化的TodoItem组件
const UnoptimizedTodoItem = ({ todo, onToggle }) => {
    console.log(`UnoptimizedTodoItem rendering: ${todo.text}`);
    
    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span>{todo.text}</span>
        </div>
    );
};

// 使用React.memo优化的TodoItem组件
const OptimizedTodoItem = React.memo(({ todo, onToggle }) => {
    console.log(`OptimizedTodoItem rendering: ${todo.text}`);
    
    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span>{todo.text}</span>
        </div>
    );
}, (prevProps, nextProps) => {
    // 自定义比较函数
    return prevProps.todo.completed === nextProps.todo.completed &&
           prevProps.todo.text === nextProps.todo.text;
}); 