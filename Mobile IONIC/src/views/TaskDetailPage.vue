<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Task Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="task">
        <h2>{{ task.name }}</h2>
        <p>Status: {{ task.done ? 'Completed' : 'Pending' }}</p>
        <p>Task ID: {{ task.id }}</p>
      </div>
      <div v-else>
        <p>Task not found.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/vue'
import { useTaskStore } from '@/stores/taskStore'

const route = useRoute()
const taskStore = useTaskStore()

// fetch the task from pinia based on url id
const task = computed(() => {
  const idParam = parseInt(route.params.id)
  return taskStore.tasks.find(t => t.id === idParam)
})
</script>
