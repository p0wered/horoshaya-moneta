import type { ConfigProxyType } from './config';

declare module 'vue-slide-up-down';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $config: ConfigProxyType
    }
}

declare global {
    interface Window {
        ym?(counterId: number, eventName: 'reachGoal', targetName: string): void;
    }
}

export {};
