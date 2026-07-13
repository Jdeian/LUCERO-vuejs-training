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

      <!-- Empty state -->
      <div class="empty-state" v-if="tasks.length === 0">
        <ion-icon :icon="checkmarkCircleOutline" class="empty-icon" />
        <p>No tasks yet. Tap <strong>+</strong> to add one!</p>
      </div>

      <!-- Task list — Ionic components replace plain div/ul/li -->
      <ion-list v-else>
        <ion-item-sliding v-for="task in tasks" :key="task.id">
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

    <ion-modal trigger="open-add-modal" :initial-breakpoint="0.35" :breakpoints="[0, 0.35]" @didDismiss="newTaskName = ''">
      <ion-header>
        <ion-toolbar>
          <ion-title>New Task</ion-title>
          <ion-buttons slot="end">
            <ion-button id="close-modal" fill="clear">Cancel</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="modal-content">
        <ion-item lines="none" class="input-row">
          <ion-input
            v-model="newTaskName"
            placeholder="What needs to be done?"
            :clear-input="true"
            @keyup.enter="submitTask"
          />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonCheckbox, IonBadge, IonChip, IonIcon,
  IonFab, IonFabButton, IonModal, IonInput, IonButton, IonButtons
} from '@ionic/vue'
import {
  addOutline, trashOutline, checkmarkCircleOutline, personCircle
} from 'ionicons/icons'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'


const taskStore = useTaskStore()
const userStore = useUserStore()
const router = useRouter()

// storeToRefs for reactive state & computed
const { tasks, totalCount, doneCount, pendingCount } = storeToRefs(taskStore)
const { displayName, isLoggedIn } = storeToRefs(userStore)

// Actions destructured directly (no storeToRefs needed)
const { addTask, toggleTask, removeTask } = taskStore

const newTaskName = ref('')

function submitTask() {
  addTask(newTaskName.value)
  newTaskName.value = ''
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
</style>
