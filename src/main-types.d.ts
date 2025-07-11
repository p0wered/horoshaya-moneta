import type { ConfigProxyType } from './config'

declare module 'vue-slide-up-down' {
    import { defineComponent } from 'vue';
    const SlideUpDown: ReturnType<typeof defineComponent>;
    export default SlideUpDown;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $config: ConfigProxyType
    }
}