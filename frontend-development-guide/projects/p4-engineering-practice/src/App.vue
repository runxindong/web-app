<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/tasks">Tasks</router-link>
      <router-link to="/team">Team</router-link>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  padding: 1rem;
  background: #f8f9fa;
}

nav {
  display: flex;
  gap: 1rem;
}

a {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

a:hover {
  background: #e9ecef;
}

a.router-link-active {
  background: #007bff;
  color: white;
}
</style> 