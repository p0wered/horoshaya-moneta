import { computed, watch, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { getCookie, setCookie } from './cookie'

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

