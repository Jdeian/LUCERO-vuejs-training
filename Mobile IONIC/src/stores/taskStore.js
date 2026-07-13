// =============================================================
//  DAY 4 ASSIGNMENT — Pinia Store: stores/taskStore.js
//  Topic: Centralized State with Pinia (state, getters, actions)
//  Files: stores/taskStore.js  |  TaskListView.vue (updated)
//  Time: 60 minutes
// =============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// TODO 1: Export a useTaskStore function using defineStore
// The store ID is 'tasks' — this appears in Vue DevTools
export const useTaskStore = defineStore('tasks', () => {

  // TODO 2: Define state using ref()
  /** @typedef {{ id: number, name: string, done: boolean }} Task */
  const tasks  = ref(/** @type {Task[]} */ ([]))
  const nextId = ref(/** @type {number} */ (1))
  const currentFilter = ref('all')

  // TODO 3: Define getters using computed()
  const totalCount   = computed(() => tasks.value.length)
  const doneCount    = computed(() => tasks.value.filter(t => t.done).length)
  const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

  // TODO 4: Define addTask(name, priority, photo) action
  // - Guard against empty names
  // - Push a new task: { id: nextId.value++, name, priority, photo, done: false }
  function addTask(name, priority = 'low', photo = '') {
    if (!name.trim()) return
    tasks.value.push({ id: nextId.value++, name, priority, photo, done: false })
  }

  // TODO 5: Define toggleTask(id) action
  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.done = !task.done
  }

  // TODO 6: Define removeTask(id) action
  function removeTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  // DAY 8: Add photo path to a task
  function addPhotoToTask(id, path) {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.photo = path
  }

  function updateTaskDetails(id, name, priority) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      if (name.trim()) task.name = name.trim()
      task.priority = priority
    }
  }

  // TODO 7: Return everything the component needs to access
  return { tasks, nextId, totalCount, doneCount, pendingCount, currentFilter, addTask, toggleTask, removeTask, addPhotoToTask, updateTaskDetails }

}, { persist: true })
