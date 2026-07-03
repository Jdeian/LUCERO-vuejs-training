<script setup>
import { ref } from 'vue'
import { useUserStore } from './stores/userStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isLoggedIn, displayName } = storeToRefs(userStore)
const { login, logout } = userStore

const loginInput = ref('')

function handleLogin() {
  login(loginInput.value)
  loginInput.value = ''
}
</script>

<template>
  <div class="app-wrapper">
    <header class="app-header">
      <nav class="navigation">
        <router-link to="/">Day 1: Counter</router-link>
        <router-link to="/day2-list">Day 2: Task List</router-link>
        <router-link to="/home">Day 3: Router</router-link>
        <router-link to="/day4-tasks">Day 4: Pinia Tasks</router-link>
        <router-link to="/day5-todos">Day 5: Todo List</router-link>
      </nav>

      <div class="user-panel">
        <template v-if="isLoggedIn">
          <span class="welcome">{{ displayName }}</span>
          <button class="btn-logout" @click="logout">Sign out</button>
        </template>
        <template v-else>
          <form class="login-form" @submit.prevent="handleLogin">
            <input
              v-model="loginInput"
              class="login-input"
              placeholder="Enter your name..."
              autocomplete="off"
            />
            <button type="submit" class="btn-login">Login</button>
          </form>
        </template>
      </div>
    </header>

    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 16px;
}

.navigation {
  display: flex;
  gap: 2px;
  flex: 1;
  justify-content: center;
}
.navigation a {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.navigation a:hover {
  background: #f3f4f6;
  color: #111827;
}
.navigation a.router-link-active {
  background: #fff0f0;
  color: #800020;
  font-weight: 600;
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome {
  font-size: 15px;
  font-weight: 600;
  color: #800020;
  background: #fff0f0;
  border: 1px solid #f5c0c0;
  border-radius: 10px;
  padding: 5px 16px;
}

.login-form {
  display: flex;
  align-items: center;
  gap: 6px;
}
.login-input {
  padding: 7px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  width: 160px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  color: #111827;
  background: #fff;
}
.login-input:focus {
  border-color: #800020;
  box-shadow: 0 0 0 3px rgba(128, 0, 32, 0.1);
}
.btn-login {
  padding: 7px 16px;
  background: #800020;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;
}
.btn-login:hover {
  background: #6b0019;
  transform: translateY(-1px);
}
.btn-logout {
  padding: 6px 14px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s;
}
.btn-logout:hover {
  background: #b91c1c;
}

.app-content {
  flex: 1;
  padding: 32px 32px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
