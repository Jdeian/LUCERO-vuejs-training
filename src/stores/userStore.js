// =============================================================
//  EXTENSION — userStore.js
//  Stores the current user's name and login state.
//  Actions: login(name), logout()
// =============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {

  const currentUser = ref('')
  const isLoggedIn  = ref(false)

  const displayName = computed(() => isLoggedIn.value ? currentUser.value : 'Guest')

  function login(name) {
    if (!name.trim()) return
    currentUser.value = name.trim()
    isLoggedIn.value  = true
  }

  function logout() {
    currentUser.value = ''
    isLoggedIn.value  = false
  }

  return { currentUser, isLoggedIn, displayName, login, logout }

}, { persist: true })
