import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory} from 'vue-router'
import {configProxy as config, loadConfig} from '@/config'
import HomeView from '@/views/HomeView.vue'
import Anketa from '@/views/Anketa.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'HomeView',
        component: HomeView,
        meta: { titleKey: '/' },
    },
    {
        path: '/apply',
        name: 'Anketa',
        component: Anketa,
        meta: { titleKey: '/apply' },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, _from, next) => {
    await loadConfig()
    const domain = window.location.origin
    const titlesMap = config[domain]?.titles as Record<string, string> | undefined
    const key = (to.meta.titleKey as string) ?? to.path
    document.title = titlesMap?.[key]
        ?? 'Займы онлайн'
    next()
})

export default router
