# хорошая-монета.рф

## Конфигурация

### Vue 3.5.17
### Vite 7.0.3
### TypeScript 5.8.3
### Tailwind 4.1.11

## Как работать с шаблоном?

### Клонировать проект 
```shell
git clone ssh://git@git.infg.tech:10022/templates/horoshaya-moneta.git
```

### Установить модули 
```shell
npm install
```

### Запустить локально
```shell
npm run dev
```

#### Конфиг для dev подгружается локально из config.local.json
#### Для build версии конфиг берётся по апи legal-data
#### В Vue компонентах к конфигу обращаться через глобальную переменную $config