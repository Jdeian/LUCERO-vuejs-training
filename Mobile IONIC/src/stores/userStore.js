// =============================================================
//  EXTENSION — userStore.js
//  Tracks the current logged-in user with persistence
// =============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {

  // State
  const currentUser = ref(/** @type {string} */ (''))
  const isLoggedIn  = ref(/** @type {boolean} */ (false))

  // Getters
  const displayName = computed(() =>
    isLoggedIn.value ? currentUser.value : 'Guest'
  )

  // Actions
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
