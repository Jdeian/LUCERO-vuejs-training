import { createRouter, createWebHistory } from 'vue-router'
import TaskCounter from '../views/day1_taskCounter.vue'
// import TaskCardDay2 from '../views/TaskCard_day2.vue'
import TaskListViewDay2 from '../views/TaskListView_day2.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'day1-counter',
      component: TaskCounter
    },
    // {
    //   path: '/day2-card',
    //   name: 'day2-card',
    //   component: TaskCardDay2
    // },
    {
      path: '/day2-list',
      name: 'day2-list',
      component: TaskListViewDay2
    }
  ]
})

export default router
