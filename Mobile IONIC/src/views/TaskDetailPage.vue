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

    <ion-content class="ion-padding-vertical" color="light">
      <div v-if="task">
        <ion-list inset="true" class="task-details-list">
          
          <ion-item>
            <ion-icon :icon="documentTextOutline" slot="start" color="primary"></ion-icon>
            <ion-label position="stacked" color="medium">Task Name</ion-label>
            <ion-text class="ion-padding-vertical" style="font-size: 1.1rem; font-weight: 500;">
              {{ task.name }}
            </ion-text>
          </ion-item>

          <ion-item>
            <ion-icon :icon="timeOutline" slot="start" color="primary"></ion-icon>
            <ion-label color="medium">Status</ion-label>
            <ion-badge slot="end" :color="task.done ? 'success' : 'medium'">
              {{ task.done ? 'Completed' : 'Pending' }}
            </ion-badge>
          </ion-item>

          <ion-item>
            <ion-icon :icon="flagOutline" slot="start" color="primary"></ion-icon>
            <ion-label color="medium">Priority</ion-label>
            <ion-badge slot="end" :color="task.priority === 'high' ? 'danger' : (task.priority === 'medium' ? 'warning' : 'primary')">
              {{ task.priority === 'high' ? 'High' : (task.priority === 'medium' ? 'Medium' : 'Low') }}
            </ion-badge>
          </ion-item>

        </ion-list>

        <div class="ion-padding">
          <ion-button 
            expand="block" 
            :color="task.done ? 'warning' : 'primary'"
            @click="taskStore.toggleTask(task.id)"
          >
            <ion-icon slot="start" :icon="task.done ? arrowUndoOutline : checkmarkDoneOutline" />
            {{ task.done ? 'Mark as Pending' : 'Mark as Completed' }}
          </ion-button>
        </div>

      </div>
      
      <div v-else class="ion-text-center ion-padding empty-state">
        <ion-icon :icon="alertCircleOutline" color="medium" style="font-size: 64px; opacity: 0.5;" />
        <p style="color: var(--ion-color-medium);">Task not found.</p>
        <ion-button fill="clear" router-link="/tabs/tasks">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonBadge, IonList, IonItem, 
  IonLabel, IonIcon, IonText, IonButton
} from '@ionic/vue'
import { 
  documentTextOutline, timeOutline, flagOutline, calendarOutline, 
  checkmarkDoneOutline, arrowUndoOutline, alertCircleOutline
} from 'ionicons/icons'
import { useTaskStore } from '@/stores/taskStore'

const route = useRoute()
const taskStore = useTaskStore()

const task = computed(() => {
  const idParam = parseInt(route.params.id)
  return taskStore.tasks.find(t => t.id === idParam)
})
</script>

<style scoped>
.task-details-list {
  margin-top: 16px;
  border-radius: 12px;
}
.empty-state {
  margin-top: 80px;
}
</style>
