import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

/**
 * Возвращает значение куки по имени или null, если нет.
 */
export function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Устанавливает cookie с именем name и значением value.
 * @param name
 * @param value
 * @param days срок жизни в днях (по умолчанию 30)
 */
export const setCookie = (name: string, value: string, days = 30) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`;
}

/**
 * Отправляет reachGoal в Яндекс.Метрику
 * @param action название
 */
export const sendMetrika = (action: string) => {
    if (typeof window !== 'undefined' && typeof window.ym !== 'undefined') {
        if (import.meta.env.DEV) {
            window.ym(93770064, 'reachGoal', action);
        } else {
            console.log('sendMetrika', action);
        }
    }
}

/**
 * Логика открытия витрины типа overloaded по таймеру
 * @param timeoutMs длительность таймера в миллисекундах
 */
export function useInactivityTimer(timeoutMs = 15 * 60 * 1000) {
    const router = useRouter();
    const route = useRoute();
    const inactivityTimer = ref<ReturnType<typeof setTimeout> | null>(null);
    const excludedRoutes = ['/apply/companys', '/offers'];

    function startTimer() {
        inactivityTimer.value = setTimeout(() => {
            router.push('/apply/companys?type=overloaded');
        }, timeoutMs);
    }

    function handleActivity() {
        if (inactivityTimer.value !== null) {
            clearTimeout(inactivityTimer.value);
        }
        startTimer();
    }

    function resetTimer() {
        if (excludedRoutes.includes(route.path)) return;
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        startTimer();
    }

    function stopTimer() {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keypress', handleActivity);
        if (inactivityTimer.value !== null) {
            clearTimeout(inactivityTimer.value);
        }
    }

    onMounted(resetTimer);
    onUnmounted(stopTimer);
}
