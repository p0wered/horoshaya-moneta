// src/router/index.ts
import { defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { configProxy as config, loadConfig } from "@/config";
import type { RouteRecordRaw } from "vue-router";
import PageLoading from "@/components/PageLoading.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: defineAsyncComponent({
            loader: () => import("@/views/HomeView.vue"),
            loadingComponent: PageLoading,
            delay: 200,
            timeout: 30000,
        }),
        meta: { titleKey: "/" },
    },
    {
        path: "/unsubscribe",
        name: "Unsubscribe",
        component: defineAsyncComponent({
            loader: () => import("@/views/Unsubscribe.vue"),
            loadingComponent: PageLoading,
            delay: 200,
            timeout: 30000,
        }),
        meta: { titleKey: "/unsubscribe" },
    },
    {
        path: "/apply",
        name: "Anketa",
        component: defineAsyncComponent({
            loader: () => import("@/views/Anketa.vue"),
            loadingComponent: PageLoading,
            delay: 200,
            timeout: 30000,
        }),
        meta: { titleKey: "/apply" },
    },
    {
        path: "/apply/companys",
        name: "Companys",
        component: defineAsyncComponent({
            loader: () => import("@/views/Companys.vue"),
            loadingComponent: PageLoading,
            delay: 200,
            timeout: 30000,
        }),
        meta: { titleKey: "/apply/companys" },
    },
    {
        path: "/apply/deeplink",
        name: "Deeplink",
        component: defineAsyncComponent({
            loader: () => import("@/views/Deeplink.vue"),
            loadingComponent: PageLoading,
            delay: 200,
            timeout: 30000,
        }),
        meta: { titleKey: "/deeplink" },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    await loadConfig();
    const domain = window.location.origin;
    const titlesMap = config[domain]?.titles as Record<string, string> | undefined;
    const key = (to.meta.titleKey as string) ?? to.path;
    document.title = titlesMap?.[key] ?? "Нужен займ?";
    next();
});

export default router;
