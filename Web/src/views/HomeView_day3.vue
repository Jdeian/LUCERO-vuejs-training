<!--
=============================================================
  DAY 3 ASSIGNMENT — HomeView.vue
  Shows the task list with router-link navigation to each task
=============================================================
-->
<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tasks = ref([
  { id: 1, name: 'Learn Vue', done: true, dueDate: '2023-01-01' },
  { id: 2, name: 'Learn Router', done: false, dueDate: '2023-01-02' },
  { id: 3, name: 'Build an App', done: false, dueDate: '2023-01-03' },
  { id: 4, name: 'Check not found error', done: false, dueDate: '2023-01-03' }
])

// TODO 1: Read route.query.error — if it equals 'notfound', show a warning banner
// const showErrorBanner = computed(() => ???)
const showErrorBanner = computed(() => route.query.error === 'notfound')
</script>

<template>
  <div class="home-view">
    <h1>📝 My Tasks</h1>

    <!-- TODO 2: Show a warning banner if showErrorBanner is true -->
    <!-- <div class="error-banner" v-if="showErrorBanner">
      ⚠️ Task not found. Redirected back to home.
    </div> -->
    <div class="error-banner" v-if="showErrorBanner">
      ⚠️ Task not found. Redirected back to home.
    </div>

    <!-- TODO 4: Render each task as a RouterLink to /task/:id -->
    <!-- Use <RouterLink :to="`/task/${task.id}`"> as the wrapper -->
    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id">
        <!-- TODO 5: Wrap this in a RouterLink -->
        <RouterLink :to="`/task/${task.id}`" style="text-decoration: none; color: inherit; display: block;">
          <span :class="{ done: task.done }">{{ task.name }}</span>
        </RouterLink>
      </li>
    </ul>

    <nav class="page-nav">
      <!-- TODO 3: Add a RouterLink to /about -->
      <!-- <RouterLink to="/about">About</RouterLink> -->
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.home-view { max-width: 520px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
h1 { color: #1B2A4A; margin-bottom: 16px; }
.error-banner { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; color: #92400e; font-size: 14px; }
.page-nav { margin-bottom: 20px; }
.page-nav a { color: #42B883; background-color: #ffffff; padding-left: 80px; padding-right: 80px; padding-top: 10px; padding-bottom: 10px; border-radius: 10px; text-decoration: none; font-weight: 600; }
.task-list { list-style: none; padding: 0; margin-top: 50px; margin-bottom: 50px; }
.task-list li { padding: 12px; background: white; border-radius: 8px; margin-bottom: 8px; border: 1px solid #eee; cursor: pointer; }
.task-list li:hover { border-color: #42B883; }
.done { text-decoration: line-through; color: #1100ff; }
</style>
