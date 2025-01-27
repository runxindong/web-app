<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: number
  title: string
  status: 'todo' | 'in-progress' | 'done'
  assignee?: string
}

const tasks = ref<Task[]>([
  { id: 1, title: 'Setup project structure', status: 'done' },
  { id: 2, title: 'Implement authentication', status: 'in-progress' },
  { id: 3, title: 'Create task management UI', status: 'todo' }
])

const newTaskTitle = ref('')

const addTask = () => {
  if (newTaskTitle.value.trim()) {
    tasks.value.push({
      id: Date.now(),
      title: newTaskTitle.value,
      status: 'todo'
    })
    newTaskTitle.value = ''
  }
}

const updateStatus = (task: Task, status: Task['status']) => {
  task.status = status
}
</script>

<template>
  <main class="tasks">
    <h1>Tasks</h1>
    
    <div class="add-task">
      <input 
        v-model="newTaskTitle"
        @keyup.enter="addTask"
        placeholder="Add new task..."
        type="text"
      >
      <button @click="addTask">Add</button>
    </div>

    <div class="task-board">
      <div class="column">
        <h2>To Do</h2>
        <div class="task-list">
          <div 
            v-for="task in tasks.filter(t => t.status === 'todo')"
            :key="task.id"
            class="task-card"
          >
            <h3>{{ task.title }}</h3>
            <div class="actions">
              <button @click="updateStatus(task, 'in-progress')">Start</button>
            </div>
          </div>
        </div>
      </div>

      <div class="column">
        <h2>In Progress</h2>
        <div class="task-list">
          <div 
            v-for="task in tasks.filter(t => t.status === 'in-progress')"
            :key="task.id"
            class="task-card"
          >
            <h3>{{ task.title }}</h3>
            <div class="actions">
              <button @click="updateStatus(task, 'done')">Complete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="column">
        <h2>Done</h2>
        <div class="task-list">
          <div 
            v-for="task in tasks.filter(t => t.status === 'done')"
            :key="task.id"
            class="task-card"
          >
            <h3>{{ task.title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.tasks {
  padding: 2rem;
}

.add-task {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.add-task input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-task button {
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.task-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.column {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.column h2 {
  margin-bottom: 1rem;
  color: #495057;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-card {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.actions button {
  padding: 0.25rem 0.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background: #0056b3;
}
</style> 