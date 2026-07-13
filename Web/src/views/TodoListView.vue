<!--
=============================================================
  DAY 5 ASSIGNMENT — TodoListView.vue
  Uses useFetch() to load and display todos from JSONPlaceholder
=============================================================
-->
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from '../composables/useFetch'

const filter = ref('all') // 'all' | 'done' | 'pending'
const search = ref('')

// TODO 1: Call useFetch with the JSONPlaceholder todos endpoint
// Rename 'data' to 'todos' using destructuring alias syntax
const { data: todos, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/todos')

// TODO 2: Create a filteredTodos computed() that:
//  - Returns [] if todos.value is null (still loading)
//  - Filters by filter.value ('all' shows first 20, 'done' shows completed, 'pending' shows incomplete)
const filteredTodos = computed(() => {
  if (!todos.value) return []
  let list = todos.value
  if (filter.value === 'done')    list = list.filter(t => t.completed)
  else if (filter.value === 'pending') list = list.filter(t => !t.completed)
  else list = list.slice(0, 20)
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(t => t.title.toLowerCase().includes(q))
  }
  return list
})
</script>

<template>
  <div class="todo-view">
    <div class="view-header">
      <h1>📋 Todo List</h1>
      <router-link to="/day5-users" class="btn-users">View Users</router-link>
    </div>
    <!-- TODO 3: Show a loading message/spinner while loading is true -->
    <div v-if="loading" class="loading">⏳ Loading todos...</div>

    <!-- TODO 4: Show an error message if error has a value -->
    <div v-else-if="error" class="error-box">
      ❌ {{ error }}
      <button class="btn-retry" @click="refetch">Retry</button>
    </div>

    <!-- TODO 5: Show the content block when NOT loading and NO error -->
    <div v-else>
      <input
        v-model="search"
        class="search-input"
        placeholder="Search todos..."
      />

      <!-- Filter buttons -->
      <div class="filters">
        <!-- TODO 6: Three buttons — All, Done, Pending -->
        <!-- Each sets filter.value and gets :class="{ active: filter === '...' }" -->
        <button :class="{ active: filter === 'all' }"     class="btn-all"     @click="filter = 'all'">All</button>
        <button :class="{ active: filter === 'done' }"    class="btn-done"    @click="filter = 'done'">Done</button>
        <button :class="{ active: filter === 'pending' }" class="btn-pending" @click="filter = 'pending'">Pending</button>
      </div>

      <!-- TODO 7: Render filteredTodos using v-for -->
      <ul class="todo-list">
        <!-- li with checkbox (disabled, reflects todo.completed) and title -->
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{ 'done-item': todo.completed }"
        >
          <input type="checkbox" :checked="todo.completed" disabled />
          <span :class="{ 'completed-text': todo.completed }">{{ todo.title }}</span>
        </li>
      </ul>

      <!-- TODO 8: Show count of visible items -->
      <p class="count">Showing {{ filteredTodos.length }} item{{ filteredTodos.length !== 1 ? 's' : '' }}</p>
    </div>
  </div>
</template>

<style scoped>
.todo-view { max-width: 560px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
.view-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
h1 { color: #1B2A4A; margin: 0; }
.btn-users { padding: 6px 14px; background: #800020; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
.btn-users:hover { background: #6b0019; }
.users-link { display: none; }
.subtitle { color: #9ca3af; font-size: 13px; margin-bottom: 20px; }
.loading { text-align: center; padding: 48px; color: #42B883; font-size: 16px; }
.error-box { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; color: #dc2626; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.btn-retry { padding: 6px 14px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.btn-retry:hover { background: #b91c1c; }
.search-input { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; margin-bottom: 12px; box-sizing: border-box; outline: none; }
.search-input:focus { border-color: #800020; box-shadow: 0 0 0 3px rgba(128,0,32,0.12); }
.filters { display: flex; gap: 8px; margin-bottom: 16px; }
.filters button { padding: 6px 16px; border: 1px solid #ddd; border-radius: 20px; background: white; cursor: pointer; font-size: 13px; }
.btn-all.active    { background: #800020; color: white; border-color: #800020; }
.btn-done.active   { background: #16a34a; color: white; border-color: #16a34a; }
.btn-pending.active{ background: #d97706; color: white; border-color: #d97706; }
.todo-list { list-style: none; padding: 0; margin: 0; }
.todo-list li { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border-radius: 6px; margin-bottom: 6px; border: 1px solid #eee; font-size: 14px; }
.todo-list li.done-item { opacity: 0.6; }
.todo-list li span { flex: 1; }
.completed-text { text-decoration: line-through; color: #9ca3af; }
.count { font-size: 13px; color: #9ca3af; margin-top: 12px; text-align: right; }
</style>

