import { reactive } from 'vue'
import localConfig from '@/config.local.json'

const configData = reactive<Record<string, any>>({});
let loaded = false;
let loading: Promise<void> | null = null;

export function getTid(): string | null {
  const params = new URLSearchParams(window.location.search);
  const urlTid = params.get('tid');

  if (urlTid) {
    document.cookie = `tid=${encodeURIComponent(urlTid)}; path=/; max-age=${30 * 24 * 60 * 60}`;
    return urlTid;
  }

  const cookieMatch = document.cookie.match(/(?:^|; )tid=([^;]+)/);
  if (cookieMatch) {
    try {
      return decodeURIComponent(cookieMatch[1])
    } catch (e) {
      console.warn('Не удалось декодировать tid из куки:', e);
    }
  }

  return null
}

export function loadConfig(): Promise<void> {
  if (loaded) return Promise.resolve();

  // для dev берёт локальный конфиг
  if (import.meta.env.DEV) {
    Object.assign(configData, localConfig);
    loaded = true;
    return Promise.resolve();
  }

  // для build использует апи конфиг
  if (!loading) {
    const tid = getTid();
    const url = new URL('/api/legal-data', window.location.origin);
    if (tid) url.searchParams.set('tid', tid);

    loading = fetch(url.toString())
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(json => {
          Object.assign(configData, json);
          loaded = true;
        })
        .catch(err => console.error('Ошибка загрузки config:', err));
  }

  return loading!
}

export const configProxy = new Proxy(reactive(configData), {
  get(target, domain: string) {
    if (!loaded) console.warn(`⚠️ Config для "${domain}" ещё не загружен!`);
    return Reflect.get(target, domain) ?? {}
  }
})

export type ConfigProxyType = typeof configProxy
