<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Team Task Management')
const description = ref('A modern task management system for agile teams')
</script>

<template>
  <main class="home">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    
    <div class="actions">
      <router-link to="/tasks" class="btn">View Tasks</router-link>
      <router-link to="/team" class="btn">Team Members</router-link>
    </div>
  </main>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.6rem;
  background: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background: #0056b3;
}
</style> 