<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="listOutline" />
          <ion-label>Tasks</ion-label>
          <ion-badge v-if="pendingCount > 0" color="warning">{{ pendingCount }}</ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="checkmarkDoneOutline" />
          <ion-label>Completed</ion-label>
          <ion-badge v-if="doneCount > 0" color="success">{{ doneCount }}</ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="personOutline" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import {
  IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon,
  IonPage, IonRouterOutlet, IonBadge
} from '@ionic/vue'
import { listOutline, checkmarkDoneOutline, personOutline } from 'ionicons/icons'

import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()
const { pendingCount, doneCount } = storeToRefs(taskStore)
</script>
