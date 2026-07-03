<!--
=============================================================
  EXTENSION — UsersView.vue
  Create a second view that fetches /users and displays a user card grid
=============================================================
-->
<script setup>
import { useFetch } from '../composables/useFetch'

const { data: users, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/users')
</script>

<template>
  <div class="users-view">
    <div class="view-header">
      <h1>Users</h1>
      <router-link to="/day5-todos" class="btn-back">Back to Todos</router-link>
    </div>

    <div v-if="loading" class="loading">Loading users...</div>

    <div v-else-if="error" class="error-box">
      {{ error }}
      <button class="btn-retry" @click="refetch">Retry</button>
    </div>

    <div v-else class="user-grid">
      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="user-avatar">{{ user.name.charAt(0) }}</div>
        <div class="user-info">
          <p class="user-name">{{ user.name }}</p>
          <p class="user-username">@{{ user.username }}</p>
          <p class="user-detail">{{ user.email }}</p>
          <p class="user-detail">{{ user.phone }}</p>
          <p class="user-detail">{{ user.website }}</p>
          <p class="user-detail">{{ user.company.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.users-view { max-width: 900px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
.view-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
h1 { color: #1B2A4A; font-size: 20px; margin: 0; }
.btn-back { padding: 6px 14px; background: #800020; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
.btn-back:hover { background: #6b0019; }
.loading { text-align: center; padding: 48px; color: #42B883; font-size: 16px; }
.error-box { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; color: #dc2626; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.btn-retry { padding: 6px 14px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.btn-retry:hover { background: #b91c1c; }
.user-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.user-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; display: flex; gap: 16px; align-items: flex-start; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: box-shadow 0.2s; }
.user-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.user-avatar { width: 44px; height: 44px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; }
.user-info { flex: 1; min-width: 0; }
.user-name { font-weight: 700; color: #111827; font-size: 15px; margin: 0 0 2px; }
.user-username { color: #6b7280; font-size: 13px; margin: 0 0 10px; }
.user-detail { color: #4b5563; font-size: 12px; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
