<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Task Details</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleEdit">
            <ion-icon :icon="isEditing ? checkmarkOutline : createOutline"></ion-icon>
          </ion-button>
          <ion-button color="danger" @click="deleteTask">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding-vertical" color="light">
      <div v-if="task">
        <ion-list inset="true" class="task-details-list">
          
          <ion-item>
            <ion-icon :icon="documentTextOutline" slot="start" color="primary"></ion-icon>
            <ion-label position="stacked" color="medium">Task Name</ion-label>
            <ion-input v-if="isEditing" v-model="editName" class="ion-padding-vertical" style="font-size: 1.1rem; font-weight: 500;" />
            <ion-text v-else class="ion-padding-vertical" style="font-size: 1.1rem; font-weight: 500;">
              {{ task.name }}
            </ion-text>
          </ion-item>

          <ion-item button @click="toggleTaskStatus">
            <ion-icon :icon="timeOutline" slot="start" color="primary"></ion-icon>
            <ion-label color="medium">Status</ion-label>
            <ion-badge slot="end" :color="task.done ? 'success' : 'warning'">
              {{ task.done ? 'Completed' : 'Pending' }}
            </ion-badge>
          </ion-item>

          <ion-item lines="none">
            <ion-icon :icon="flagOutline" slot="start" color="primary"></ion-icon>
            <ion-label color="medium">Priority</ion-label>
            <ion-select v-if="isEditing" v-model="editPriority" interface="popover" slot="end">
              <ion-select-option value="low">Low</ion-select-option>
              <ion-select-option value="medium">Medium</ion-select-option>
              <ion-select-option value="high">High</ion-select-option>
            </ion-select>
            <ion-badge v-else slot="end" :color="task.priority === 'high' ? 'danger' : (task.priority === 'medium' ? 'warning' : 'primary')">
              {{ task.priority === 'high' ? 'High' : (task.priority === 'medium' ? 'Medium' : 'Low') }}
            </ion-badge>
          </ion-item>

        </ion-list>

        <!-- Display the photo if it exists -->
        <div v-if="task.photo" class="photo-section">
          <ion-img :src="task.photo" class="task-photo" />
        </div>

        <!-- Two hidden inputs: camera and gallery -->
        <input id="detail-camera-input" type="file" accept="image/*" capture="environment" style="display:none" @change="onPhotoSelected" />
        <input id="detail-gallery-input" type="file" accept="image/*" style="display:none" @change="onPhotoSelected" />

        <div class="ion-padding action-buttons">
          <!-- Add a Photo button using programmatic action sheet -->
          <ion-button expand="block" fill="outline" color="primary" @click="showAddPhotoSheet">
            <ion-icon slot="start" :icon="cameraOutline" />
            {{ task.photo ? 'Change Photo' : 'Add a Photo' }}
          </ion-button>

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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonBadge, IonList, IonItem, 
  IonLabel, IonIcon, IonText, IonButton, IonImg,
  IonInput, IonSelect, IonSelectOption
} from '@ionic/vue'
import { 
  documentTextOutline, timeOutline, flagOutline,
  checkmarkDoneOutline, arrowUndoOutline, alertCircleOutline,
  cameraOutline, createOutline, checkmarkOutline, trashOutline
} from 'ionicons/icons'
import { useTaskStore } from '@/stores/taskStore'
import { usePhotoPicker } from '@/composables/usePhotoPicker'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const { pickPhoto } = usePhotoPicker()

const idParam = Number(route.params.id)

const isEditing = ref(false)
const editName = ref('')
const editPriority = ref('')

const task = computed(() => {
  return taskStore.tasks.find(t => t.id === idParam)
})

watch(task, (newTask) => {
  if (newTask) {
    editName.value = newTask.name
    editPriority.value = newTask.priority
  }
}, { immediate: true })

function toggleEdit() {
  if (isEditing.value) {
    taskStore.updateTaskDetails(task.value.id, editName.value, editPriority.value)
  }
  isEditing.value = !isEditing.value
}

function toggleTaskStatus() {
  taskStore.toggleTask(task.value.id)
}

function deleteTask() {
  taskStore.removeTask(task.value.id)
  router.replace('/tabs/tasks')
}

// Action sheet for photo selection
async function showAddPhotoSheet() {
  const path = await pickPhoto('detail-camera-input', 'detail-gallery-input')
  if (path && task.value) {
    taskStore.addPhotoToTask(task.value.id, path)
  }
}

function onPhotoSelected(event) {
  const file = event.target.files?.[0]
  if (file && task.value) {
    taskStore.addPhotoToTask(task.value.id, URL.createObjectURL(file))
  }
}
</script>

<style scoped>
.task-details-list {
  margin-top: 16px;
  border-radius: 12px;
}
.empty-state {
  margin-top: 80px;
}

.photo-section {
  margin: 8px 16px 0;
  border-radius: 12px;
  overflow: hidden;
}
.task-photo {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 12px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
