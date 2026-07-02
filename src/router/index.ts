import { createRouter, createWebHistory } from 'vue-router'
import TaskCounter from '../views/day1_taskCounter.vue'
import TaskListViewDay2 from '../views/TaskListView_day2.vue'
import HomeViewDay3 from '../views/HomeView_day3.vue'
import TaskDetailView from '../views/TaskDetailView.vue'
import AboutView from '../views/AboutView.vue'
import TaskListView from '../views/TaskListView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'day1-counter',
      component: TaskCounter
    },
    {
      path: '/day2-list',
      name: 'day2-list',
      component: TaskListViewDay2
    },
    {
      path: '/home',
      name: 'day3-home',
      component: HomeViewDay3
    },
    {
      path: '/task/:id',
      name: 'task-detail',
      component: TaskDetailView,
      meta: { requiresTask: true }
    },
    {
      path: '/day4-tasks',
      name: 'day4-tasks',
      component: TaskListView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

const tasks = [
  { id: 1 },
  { id: 2 },
  { id: 3 }
]

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresTask) {
    const taskExists = tasks.some(t => t.id === Number(to.params.id))
    if (!taskExists) {
      next({ path: '/home', query: { error: 'notfound' } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
