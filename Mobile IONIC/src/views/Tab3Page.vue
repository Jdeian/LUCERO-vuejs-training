<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="profile-card">
        <ion-card-header>
          <div class="avatar-row">
            <div class="avatar-circle">
              <ion-icon :icon="personCircle" class="avatar-icon" />
            </div>
          </div>
          <ion-card-title class="text-center">
            {{ isLoggedIn ? displayName : 'Guest User' }}
          </ion-card-title>
          <ion-card-subtitle class="text-center">
            {{ isLoggedIn ? 'Logged in' : 'Not logged in' }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-badge :color="isLoggedIn ? 'success' : 'medium'" class="status-pill">
            {{ isLoggedIn ? '● Online' : '○ Offline' }}
          </ion-badge>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="!isLoggedIn" class="login-card">
        <ion-card-header>
          <ion-card-title>Login</ion-card-title>
          <ion-card-subtitle>Enter your name to get started</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="full" class="name-input">
            <ion-label position="floating">Your Name</ion-label>
            <ion-input
              v-model="nameInput"
              placeholder="e.g. Jade"
              :clear-input="true"
              @keyup.enter="handleLogin"
            />
          </ion-item>
          <ion-button
            expand="block"
            color="primary"
            class="login-btn"
            @click="handleLogin"
            :disabled="!nameInput.trim()"
          >
            <ion-icon slot="start" :icon="logInOutline" />
            Login
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-list v-else lines="full" class="actions-list">
        <ion-list-header>
          <ion-label>Account</ion-label>
        </ion-list-header>

        <ion-item button @click="showChangeNameAlert = true">
          <ion-icon slot="start" :icon="createOutline" color="primary" />
          <ion-label>Change Name</ion-label>
        </ion-item>

        <ion-item button @click="handleLogout" class="logout-row">
          <ion-icon slot="start" :icon="logOutOutline" color="danger" />
          <ion-label color="danger">Logout</ion-label>
        </ion-item>
      </ion-list>

      <ion-list lines="full" class="actions-list">
        <ion-list-header>
          <ion-label>Task Summary</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-icon slot="start" :icon="listOutline" color="primary" />
          <ion-label>Total Tasks</ion-label>
          <ion-note slot="end">{{ totalCount }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :icon="timeOutline" color="warning" />
          <ion-label>Pending</ion-label>
          <ion-note slot="end" color="warning">{{ pendingCount }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :icon="checkmarkCircleOutline" color="success" />
          <ion-label>Completed</ion-label>
          <ion-note slot="end" color="success">{{ doneCount }}</ion-note>
        </ion-item>
      </ion-list>

      <ion-alert
        :is-open="showChangeNameAlert"
        header="Change Name"
        :inputs="[{ name: 'name', type: 'text', placeholder: 'New name', value: currentUser }]"
        :buttons="alertButtons"
        @didDismiss="showChangeNameAlert = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonListHeader, IonItem, IonLabel, IonInput, IonButton,
  IonIcon, IonBadge, IonNote, IonAlert
} from '@ionic/vue'
import {
  personCircle, logInOutline, logOutOutline, createOutline,
  listOutline, timeOutline, checkmarkCircleOutline
} from 'ionicons/icons'

import { useUserStore } from '@/stores/userStore'
import { useTaskStore } from '@/stores/taskStore'

const userStore = useUserStore()
const taskStore = useTaskStore()

// storeToRefs for reactive state & computed
const { currentUser, isLoggedIn, displayName } = storeToRefs(userStore)
const { totalCount, doneCount, pendingCount }  = storeToRefs(taskStore)

// Actions directly
const { login, logout } = userStore

const nameInput          = ref('')
const showChangeNameAlert = ref(false)

const alertButtons = [
  { text: 'Cancel', role: 'cancel', handler: () => showChangeNameAlert.value = false },
  { text: 'Save', handler: (data) => { login(data.name); showChangeNameAlert.value = false } }
]

function handleLogin() {
  if (!nameInput.value.trim()) return
  login(nameInput.value)
  nameInput.value = ''
}

function handleLogout() {
  logout()
}
</script>

<style scoped>
.profile-card {
  margin: 16px;
  border-radius: 20px;
}
.avatar-row {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--ion-color-primary-tint);
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-icon { font-size: 52px; color: var(--ion-color-primary); }
.text-center { text-align: center; }
.status-pill {
  display: block;
  width: fit-content;
  margin: 8px auto 0;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
}
.login-card { margin: 0 16px 16px; border-radius: 16px; }
.name-input { margin-bottom: 8px; }
.login-btn  { margin-top: 12px; }
.actions-list { margin: 0 16px 16px; border-radius: 12px; overflow: hidden; }
.logout-row ion-label { font-weight: 600; }
</style>
