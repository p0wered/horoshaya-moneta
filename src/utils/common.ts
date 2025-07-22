import { onMounted, onUnmounted, ref, computed, watch, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";

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
 * Определяет, есть ли utm_source в query параметрах или cookie и записывает
 * результат в переменную hasUtmSource. Также, если непустой utm_source есть
 * в query параметрах, то он записывается в cookie. Это происходит при каждой
 * загрузке любой страницы.
 */
export function useUtmSource() {
    const route = useRoute()

    const hasUtmSource = computed(() => {
        const utmQuery = route.query.utm_source
        if (utmQuery && String(utmQuery).trim() !== '') {
            return true
        }
        const utmCookie = getCookie('utm_source')
        return !!utmCookie && utmCookie.trim() !== ''
    })

    const writeUtmToCookie = (utmValue: unknown) => {
        const str = String(utmValue || '').trim()
        if (str !== '') {
            setCookie('utm_source', str, 30)
        }
    }

    onBeforeMount(() => {
        writeUtmToCookie(route.query.utm_source)
    })

    watch(
        () => route.query.utm_source,
        (newVal, oldVal) => {
            if (newVal !== oldVal) {
                writeUtmToCookie(newVal)
            }
        }
    )

    return { hasUtmSource }
}

/**
 * Отправляет reachGoal в Яндекс.Метрику
 * @param action название
 */
export const sendMetrika = (action: string) => {
    if (typeof window !== 'undefined' && typeof window.ym !== 'undefined') {
        if (!import.meta.env.DEV) {
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

/**
 * Записывает query параметры sub1-sub7, web_id, click_id в cookie
 */
export const saveQueryToCookie = () => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const keys = [
        'sub1','sub2','sub3','sub4','sub5','sub6','sub7',
        'web_id','click_id'
    ];

    keys.forEach(key => {
        const val = params.get(key);
        if (val && val.trim() !== '') {
            setCookie(key, val);
        }
    })
}
