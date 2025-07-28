import { onMounted, onUnmounted, ref, computed, watch, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Router } from "vue-router";

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
 * Стирает utm_source из query параметров
 */
export const removeUtmFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('utm_source')) {
        urlParams.delete('utm_source');

        const newSearch = urlParams.toString();
        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');

        window.history.replaceState({}, '', newUrl);
    }
}

/**
 * Переход к анкете с открытием double витрины
 */
export const navigateToApply = (router: Router ) => {
    const currentQueryParams = new URLSearchParams(window.location.search).toString();
    const newTabUrl = `/apply${currentQueryParams ? '?' + currentQueryParams : ''}`;

    window.open(newTabUrl, '_blank');

    router.push({
        path: '/apply/companys',
        query: {
            type: 'double'
        }
    });
};

/**
 * Определяет, прошло ли 30 минут с момента успешной привязки карты
 */
export const isConversionSuccess = (): boolean => {
    const conversionSuccess = localStorage.getItem("conversionSuccess");

    if (!conversionSuccess) {
        return false;
    }

    const conversionTimestamp = parseInt(conversionSuccess, 10);
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 минут

    return (currentTime - conversionTimestamp) > thirtyMinutes;
};

/**
 * Определяет, есть ли utm_source в query параметрах или cookie и записывает
 * результат в переменную hasUtmSource. Также, если непустой utm_source есть
 * в query параметрах, то он записывается в cookie.
 */
export function useUtmSource() {
    const route = useRoute();

    const hasUtmSource = computed(() => {
        if (isConversionSuccess()) {
            removeUtmFromUrl();
            document.cookie = `${encodeURIComponent('utm_source')}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            localStorage.removeItem('conversionSuccess');
            return false;
        }

        const utmQuery = route.query.utm_source
        if (utmQuery && String(utmQuery).trim() !== '') {
            return true;
        }
        const utmCookie = getCookie('utm_source');
        return !!utmCookie && utmCookie.trim() !== '';
    })

    const writeUtmToCookie = (utmValue: unknown) => {
        const str = String(utmValue || '').trim();
        if (str !== '') {
            setCookie('utm_source', str, 30);
        }
    }

    onBeforeMount(() => {
        if (!isConversionSuccess()) {
            writeUtmToCookie(route.query.utm_source);
        }
    })

    watch(
        () => route.query.utm_source,
        (newVal, oldVal) => {
            if (newVal !== oldVal && !isConversionSuccess()) {
                writeUtmToCookie(newVal);
            }
        }
    )
    return { hasUtmSource }
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
 * Форматирует номер телефона в вид "+7 (XXX) XXX-XX-XX".
 * Удаляет все нецифровые символы и применяет маску.
 * @param rawPhone Необработанный номер телефона (например, "79031234567").
 * @returns Отформатированный номер или пустая строка, если номер некорректен.
 */
function formatPhoneNumber(rawPhone: string): string {
    const cleaned = rawPhone.replace(/\D/g, ''); // Удаляем все, кроме цифр
    if (!cleaned.startsWith('7') && !cleaned.startsWith('8') || cleaned.length !== 11) {
        return '';
    }
    const finalPhone = cleaned.startsWith('8') ? '7' + cleaned.substring(1) : cleaned;
    return `+7 (${finalPhone.substring(1, 4)}) ${finalPhone.substring(4, 7)}-${finalPhone.substring(7, 9)}-${finalPhone.substring(9, 11)}`;
}

/**
 * Записывает указанные query параметры в cookie и localStorage
 */
export const saveQuery = (cookieDays: number = 30) => {
    const params = new URLSearchParams(window.location.search);

    const cookieKeys = [
        'sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7',
        'click_id',
        'utm_source',
    ];

    const localStorageKeys = [
        'phone',
        'first_name',
        'last_name',
        'patronymic',
        'email',
        'birthday',
    ];

    cookieKeys.forEach(key => {
        const val = params.get(key);
        if (val && val.trim() !== '') {
            setCookie(key, val, cookieDays);
        }
    });

    localStorageKeys.forEach(key => {
        const val = params.get(key);
        if (val && val.trim() !== '') {
            localStorage.setItem(key, val);
        }
    });

    const rawPhone = params.get('phone');
    if (rawPhone && rawPhone.trim() !== '') {
        const formattedPhone = formatPhoneNumber(rawPhone);
        if (formattedPhone) {
            localStorage.setItem('phone', formattedPhone);
        }
    }

    const webIdSources = ['web_id', 'wm_id', 'plid', 'campaign'];
    let foundWebIdValue: string | null = null;

    for (const sourceKey of webIdSources) {
        const val = params.get(sourceKey);
        if (val && val.trim() !== '') {
            foundWebIdValue = val;
            break;
        }
    }

    if (foundWebIdValue) {
        setCookie('web_id', foundWebIdValue, cookieDays);
    }
};

/**
 * Возвращает значения слайдеров из sessionStorage
 */
export const getLoanData = () => {
    const savedCalculations = sessionStorage.getItem('savedCalculations');

    if (!savedCalculations) return { amount: 50000, period: 30 };

    try {
        const parsedData = JSON.parse(savedCalculations);
        return {
            amount: typeof parsedData?.amount === 'number' ? parsedData.amount : 50000,
            period: typeof parsedData?.period === 'number' ? parsedData.period : 30
        };
    } catch (error) {
        console.error('Ошибка получения savedCalculations:', error);
        return { amount: 50000, period: 30 };
    }
};

