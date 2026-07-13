<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Completed</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Completed</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="done-summary">
        <ion-chip color="success" outline>
          <ion-icon :icon="checkmarkDoneOutline" />
          <ion-label>{{ doneCount }} task{{ doneCount !== 1 ? 's' : '' }} completed</ion-label>
        </ion-chip>
      </div>

      <div class="empty-state" v-if="doneTasks.length === 0">
        <ion-icon :icon="trophyOutline" class="empty-icon" />
        <p>No completed tasks yet.<br>Go finish something!</p>
      </div>

      <ion-list v-else>
        <ion-item-sliding v-for="task in doneTasks" :key="task.id">
          <ion-item lines="full" class="done-item">
            <ion-icon :icon="checkmarkCircle" slot="start" color="success" />
            <ion-label>
              <h2 class="line-through">{{ task.name }}</h2>
            </ion-label>
            <ion-button slot="end" fill="clear" color="medium" @click="toggleTask(task.id)">
              <ion-icon slot="icon-only" :icon="arrowUndoOutline" />
            </ion-button>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" @click="removeTask(task.id)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonIcon, IonChip, IonButton
} from '@ionic/vue'
import {
  checkmarkDoneOutline, checkmarkCircle, trophyOutline,
  trashOutline, arrowUndoOutline
} from 'ionicons/icons'
import { useTaskStore } from '@/stores/taskStore'


const taskStore = useTaskStore()
const { tasks, doneCount } = storeToRefs(taskStore)
const { toggleTask, removeTask } = taskStore

const doneTasks = computed(() => tasks.value.filter(t => t.done))
</script>

<style scoped>
.done-summary {
  display: flex;
  justify-content: center;
  margin: 20px 16px 8px;
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
.done-item { opacity: 0.8; }
.line-through { text-decoration: line-through; }
</style>
