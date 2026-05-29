# VibeChannel

Уютное пиксельное интернет-радио для ночного кодинга, отдыха и выходных.

Адрес: https://brianfox.ru/vibechannel/

## Статус

MVP развернут на `brianfox.ru/vibechannel`.

## Что уже есть

- React + TypeScript интерфейс в стиле выбранного мокапа `010-pixel-pocket-radio`.
- Fastify API.
- SQLite-хранилище для избранного, истории прослушивания и заметки вечера.
- Станции SomaFM и Radio Browser/fallback-каталог.
- Mobile First компоновка с нижней навигацией.
- Проверки через Vitest и Testing Library.

## Команды

```bash
npm install
npm test
npm run build
npm run start
```

## Сервер

По умолчанию приложение слушает `127.0.0.1:4174` и использует базу:

```bash
/var/lib/vibechannel/vibechannel.sqlite
```

Переменные:

```bash
PORT=4174
HOST=127.0.0.1
VIBECHANNEL_DB=/var/lib/vibechannel/vibechannel.sqlite
```

## Принципы

- React + TypeScript + SQLite.
- Mobile First: смартфон — основной сценарий, десктоп расширяет опыт.
- TDD: сначала падающий тест, потом минимальный код.
- Источники станций: Radio Browser и SomaFM.
- Визуальная база: минималистичный Pixel Pocket Radio без TUI/terminal-перегруза.
