import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory} from 'vue-router';
import {configProxy as config, loadConfig} from '@/config';

const HomeView = () => import('@/views/HomeView.vue');
const Anketa = () => import('@/views/Anketa.vue');
const Companys = () => import('@/views/Companys.vue');
const Unsubscribe = () => import('@/views/Unsubscribe.vue');
const Deeplink = () => import('@/views/Deeplink.vue');

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { titleKey: '/' },
    },
    {
        path: '/unsubscribe',
        name: 'Unsubscribe',
        component: Unsubscribe,
        meta: { titleKey: '/unsubscribe' },
    },
    {
        path: '/apply',
        name: 'Anketa',
        component: Anketa,
        meta: { titleKey: '/apply' },
    },
    {
        path: '/apply/companys',
        name: 'Companys',
        component: Companys,
        meta: { titleKey: '/apply/companys' },
    },
    {
        path: '/apply/deeplink',
        name: 'Deeplink',
        component: Deeplink,
        meta: { titleKey: '/deeplink' },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0, left: 0 }
    }
})

router.beforeEach(async (to, _from, next) => {
    await loadConfig();
    const titlesMap = config?.titles as Record<string, string> | undefined;
    const key = (to.meta.titleKey as string) ?? to.path;
    document.title = titlesMap?.[key]
        ?? 'Нужен займ?'
    next();
});

export default router;
