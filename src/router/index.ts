import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from 'vue-router'
import { configProxy as config } from '@/config'
import Anketa from "../views/Anketa.vue";
import HomeView from "../views/HomeView.vue";

const domain = window.location.origin;

const routes : RouteRecordRaw[] = [
    {
        path: "/",
        component: HomeView,
        name: 'HomeView',
        meta: {
            title: `${config[domain].siteName} — мгновенные онлайн займы на карту. Персональный подбор займов`,
        },
    },
    {
        path: "/anketa",
        component: Anketa,
        name: 'Anketa',
        meta: {
            title: `${config[domain].siteName} — мгновенные онлайн займы на карту. Персональный подбор займов`,
        },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

export default router;
