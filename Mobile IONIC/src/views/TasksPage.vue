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
          <ion-item :class="{ 'task-done': task.done }" lines="full" button @click="goToDetail(task.id)">
            <ion-checkbox
              slot="start"
              :checked="task.done"
              @ionChange="toggleTask(task.id)"
              @click.stop
            />
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
            <ion-badge slot="end" :color="task.done ? 'success' : 'medium'" class="status-badge">
              {{ task.done ? 'Done' : 'Pending' }}
            </ion-badge>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" @click="removeTask(task.id)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
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

    <ion-modal trigger="open-add-modal" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75]" @didDismiss="resetForm">
      <ion-header>
        <ion-toolbar>
          <ion-title>New Task</ion-title>
          <ion-buttons slot="end">
            <ion-button fill="clear" @click="closeModal">Cancel</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="modal-content">
        <ion-item lines="full" class="input-row">
          <ion-input
            v-model="newTaskName"
            placeholder="What needs to be done?"
            :clear-input="true"
          />
        </ion-item>
        <ion-item lines="full">
          <ion-select v-model="newTaskPriority" placeholder="Priority" interface="popover">
            <ion-select-option value="low">Low Priority</ion-select-option>
            <ion-select-option value="medium">Medium Priority</ion-select-option>
            <ion-select-option value="high">High Priority</ion-select-option>
          </ion-select>
        </ion-item>
        <div class="modal-btn-row">
          <ion-button expand="block" color="primary" @click="submitTask">
            <ion-icon slot="start" :icon="addOutline" />
            Add Task
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonCheckbox, IonBadge, IonChip, IonIcon,
  IonFab, IonFabButton, IonModal, IonInput, IonButton, IonButtons, IonSelect, IonSelectOption,
  IonSegment, IonSegmentButton
} from '@ionic/vue'
import {
  addOutline, trashOutline, checkmarkCircleOutline, personCircle
} from 'ionicons/icons'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'


const taskStore = useTaskStore()
const userStore = useUserStore()
const router = useRouter()

// storeToRefs for reactive state
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

// Actions destructured directly
const { addTask, toggleTask, removeTask } = taskStore

const newTaskName = ref('')
const newTaskPriority = ref('low')

function resetForm() {
  newTaskName.value = ''
  newTaskPriority.value = 'low'
}

function submitTask() {
  addTask(newTaskName.value, newTaskPriority.value)
  resetForm()
  closeModal()
}

function closeModal() {
  const modal = document.querySelector('ion-modal')
  modal?.dismiss()
}

// navigate to task detail page
function goToDetail(id) {
  router.push('/tabs/tasks/' + id)
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

.modal-content { padding: 8px 0; }
.input-row { margin: 12px 8px 4px; }
.modal-btn-row { margin: 12px 16px; }

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
</style>
