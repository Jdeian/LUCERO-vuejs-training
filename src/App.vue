<script setup lang="ts">
</script>

<template>
  <div class="app-container">
    <nav class="navigation">
      <router-link to="/">Day 1: Counter</router-link>
      <router-link to="/day2-list">Day 2: Task List</router-link>
      <router-link to="/home">Day 3: Router</router-link>
    </nav>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.navigation {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.navigation a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: bold;
}
.navigation a.router-link-active {
  color: #42b983;
}
.content {
  padding: 20px 0;
}
</style>
