<script setup lang="ts">
import { ref } from 'vue'

interface TeamMember {
  id: number
  name: string
  role: string
  avatar: string
}

const team = ref<TeamMember[]>([
  {
    id: 1,
    name: 'John Doe',
    role: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Backend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
  }
])
</script>

<template>
  <main class="team">
    <h1>Team Members</h1>
    
    <div class="team-grid">
      <div 
        v-for="member in team"
        :key="member.id"
        class="member-card"
      >
        <img :src="member.avatar" :alt="member.name">
        <h3>{{ member.name }}</h3>
        <p>{{ member.role }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.team {
  padding: 2rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.member-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.member-card img {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 1rem;
}

.member-card h3 {
  margin: 0;
  color: #2c3e50;
}

.member-card p {
  margin: 0.5rem 0 0;
  color: #666;
}
</style> 