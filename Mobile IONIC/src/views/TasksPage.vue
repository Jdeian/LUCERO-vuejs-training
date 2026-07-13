<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
        <ion-buttons slot="end">
          <ion-chip color="primary" v-if="isLoggedIn">
            <ion-icon :icon="personCircle" />
            <ion-label>{{ displayName }}</ion-label>
          </ion-chip>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tasks</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-num">{{ totalCount }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-num pending">{{ pendingCount }}</span>
          <span class="stat-label">Pending</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-num done">{{ doneCount }}</span>
          <span class="stat-label">Done</span>
        </div>
      </div>

      <div class="ion-padding-horizontal ion-padding-bottom">
        <ion-segment v-model="currentFilter" mode="ios">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="pending">
            <ion-label>Pending</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Completed</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- Empty state -->
      <div class="empty-state" v-if="filteredTasks.length === 0">
        <ion-icon :icon="checkmarkCircleOutline" class="empty-icon" />
        <p>No tasks yet. Tap <strong>+</strong> to add one!</p>
      </div>

      <!-- Task list -->
      <ion-list v-else>
        <ion-item-sliding v-for="task in filteredTasks" :key="task.id">
          <ion-item 
            :class="{ 'task-done': task.done }" 
            lines="full" 
            button 
            :router-link="'/tabs/tasks/' + task.id"
            router-direction="forward"
          >
            <ion-checkbox
              slot="start"
              :checked="task.done"
              @ionChange="toggleTask(task.id)"
              @click.stop
            />
            <ion-thumbnail slot="start" v-if="task.photo" class="task-thumbnail">
              <ion-img :src="task.photo" />
            </ion-thumbnail>
            <ion-label>
              <h2 :class="{ 'line-through': task.done }">{{ task.name }}</h2>
            </ion-label>
            <ion-badge 
              slot="end" 
              :color="task.priority === 'high' ? 'danger' : (task.priority === 'medium' ? 'warning' : 'primary')" 
              class="status-badge"
              style="margin-right: 8px;"
            >
              {{ task.priority === 'high' ? 'High' : (task.priority === 'medium' ? 'Medium' : 'Low') }}
            </ion-badge>
            <ion-badge slot="end" :color="task.done ? 'success' : 'warning'" class="status-badge" style="margin-right: 8px;">
              {{ task.done ? 'Done' : 'Pending' }}
            </ion-badge>
            <!-- Swipe indicator -->
            <ion-icon slot="end" :icon="chevronBackOutline" color="medium" style="opacity: 0.4; font-size: 1.1rem; margin: 0; padding: 0;" />
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" @click="removeTask(task.id)" style="width: 50px;">
              <ion-icon slot="icon-only" :icon="trashOutline" style="font-size: 1.2rem;" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button id="open-add-modal" color="primary">
        <ion-icon :icon="addOutline" />
      </ion-fab-button>
    </ion-fab>

    <ion-modal trigger="open-add-modal" :initial-breakpoint="0.55" :breakpoints="[0, 0.55, 0.75]" @didDismiss="resetForm">
      <ion-header>
        <ion-toolbar>
          <ion-title>New Task</ion-title>
          <ion-buttons slot="end">
            <ion-button fill="clear" @click="closeModal">Cancel</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="modal-content ion-padding">
        <ion-item class="form-item" lines="full">
          <ion-input
            label="Task Name"
            label-placement="floating"
            v-model="newTaskName"
            placeholder="e.g., Buy groceries"
            :clear-input="true"
          />
        </ion-item>
        
        <ion-item class="form-item" lines="full">
          <ion-select 
            label="Priority" 
            label-placement="stacked" 
            v-model="newTaskPriority" 
            placeholder="Select Priority" 
            interface="popover"
          >
            <ion-select-option value="low">Low Priority</ion-select-option>
            <ion-select-option value="medium">Medium Priority</ion-select-option>
            <ion-select-option value="high">High Priority</ion-select-option>
          </ion-select>
        </ion-item>
        <!-- Two hidden inputs: one forces camera, one opens gallery -->
        <input id="camera-input" type="file" accept="image/*" capture="environment" style="display:none" @change="onPhotoSelected" />
        <input id="gallery-input" type="file" accept="image/*" style="display:none" @change="onPhotoSelected" />
        <div class="modal-btn-row">
          <ion-button expand="block" fill="outline" color="primary" @click="showAddPhotoSheet">
            <ion-icon slot="start" :icon="cameraOutline" />
            {{ newTaskPhoto ? 'Photo Added ✓' : 'Add a Photo' }}
          </ion-button>
        </div>
        <div class="modal-btn-row">
          <ion-button expand="block" color="primary" @click="submitTask">
            <ion-icon slot="start" :icon="checkmarkOutline" />
            Save Task
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonCheckbox, IonBadge, IonChip, IonIcon, IonThumbnail, IonImg,
  IonFab, IonFabButton, IonModal, IonInput, IonButton, IonButtons, IonSelect, IonSelectOption,
  IonSegment, IonSegmentButton, toastController
} from '@ionic/vue'
import {
  addOutline, trashOutline, checkmarkCircleOutline, personCircle, cameraOutline, checkmarkOutline, chevronBackOutline
} from 'ionicons/icons'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'
import { usePhotoPicker } from '@/composables/usePhotoPicker'

const taskStore = useTaskStore()
const userStore = useUserStore()
const { pickPhoto } = usePhotoPicker()

const { tasks, totalCount, doneCount, pendingCount, currentFilter } = storeToRefs(taskStore)
const { displayName, isLoggedIn } = storeToRefs(userStore)

const filteredTasks = computed(() => {
  if (currentFilter.value === 'pending') {
    return tasks.value.filter(t => !t.done)
  }
  if (currentFilter.value === 'completed') {
    return tasks.value.filter(t => t.done)
  }
  return tasks.value
})

const { addTask, toggleTask, removeTask } = taskStore

const newTaskName = ref('')
const newTaskPriority = ref('low')
const newTaskPhoto = ref('')

// Fallback action sheet for modal
async function showAddPhotoSheet() {
  const path = await pickPhoto('camera-input', 'gallery-input')
  if (path) newTaskPhoto.value = path
}

function onPhotoSelected(event) {
  const file = event.target.files?.[0]
  if (file) newTaskPhoto.value = URL.createObjectURL(file)
}

function resetForm() {
  newTaskName.value = ''
  newTaskPriority.value = 'low'
  newTaskPhoto.value = ''
}

async function submitTask() {
  if (!newTaskName.value.trim()) {
    const toast = await toastController.create({
      message: 'Task name is required',
      duration: 2000,
      color: 'danger',
      position: 'top'
    })
    await toast.present()
    return
  }
  
  if (!newTaskPriority.value) {
    const toast = await toastController.create({
      message: 'Please select a priority',
      duration: 2000,
      color: 'danger',
      position: 'top'
    })
    await toast.present()
    return
  }

  addTask(newTaskName.value, newTaskPriority.value, newTaskPhoto.value || '')
  resetForm()
  closeModal()
}

function closeModal() {
  const modal = document.querySelector('ion-modal')
  modal?.dismiss()
}
</script>

<style scoped>
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 16px 16px 8px;
  padding: 14px 12px;
  background: var(--ion-card-background, #1e1e2e);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.25);
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-num {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--ion-text-color);
  line-height: 1;
}
.stat-num.pending { color: var(--ion-color-warning); }
.stat-num.done    { color: var(--ion-color-success); }
.stat-label {
  font-size: 0.72rem;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--ion-color-light);
  opacity: 0.3;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: var(--ion-color-medium);
  text-align: center;
}
.empty-icon {
  font-size: 64px;
  opacity: 0.35;
  margin-bottom: 12px;
}

.task-done { opacity: 0.65; }
.line-through { text-decoration: line-through; }
.status-badge { font-size: 0.65rem; }

.modal-content { 
  --padding-top: 16px; 
}
.form-item {
  margin-bottom: 8px;
}
.modal-btn-row { 
  margin: 16px 0; 
}

ion-segment {
  --background: var(--ion-color-step-100, #1e1e1e);
  border-radius: 10px;
}
ion-segment-button {
  --padding-top: 6px;
  --padding-bottom: 6px;
  font-size: 0.75rem;
  min-height: 32px;
  text-transform: none;
  letter-spacing: 0;
}
ion-segment-button ion-label {
  font-size: 0.78rem;
  font-weight: 500;
  margin: 0;
}

/* Small thumbnail in task list */
.task-thumbnail {
  --size: 40px;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 6px;
}

/* Adjust title size for mobile */
@media (max-width: 480px) {
  ion-title {
    font-size: 1.1rem;
  }
}
</style>
