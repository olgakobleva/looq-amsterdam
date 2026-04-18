# План реализации сайта: La Bandita Wine
## Новый веб-сайт для рынка ритейлеров и ресторанов

---

## КОНЦЕПЦИЯ

**Tagline предложение**: *"Where Tuscany Meets the Table"*

Сайт должен быть живым, кинематографичным и конвертирующим. Он одновременно говорит двум аудиториям: **профессиональным закупщикам** (рестораны, ритейлеры, импортёры) и **конечным потребителям**. Каждый элемент дизайна — это продолжение бутылки.

---

## ДИЗАЙН-СИСТЕМА

### Цветовая палитра (на основе этикеток)
```
Primary:
  --color-burgundy:    #5C1A1A   (основной, этикетка красного)
  --color-gold:        #C9A84C   (акцент, премиум детали)
  --color-parchment:   #F5EED8   (фон, этикетки)

Secondary:
  --color-charcoal:    #1C1C1E   (текст, навигация)
  --color-terracotta:  #A0522D   (вторичный тёплый)
  --color-sage:        #7C8C6E   (для белого/rosé вина)
  --color-cream:       #FAF6EE   (background страниц)
```

### Типографика (modern sans-serif)
```
Display / Hero:      "Neue Haas Grotesk Display" или "Aktiv Grotesk Ex"
                     Fallback: "DM Sans" (Google Fonts, бесплатно)

Headings H2–H3:      "DM Sans" Medium 600
Body:                "Inter" Regular 400, 16px, line-height 1.75
Captions / Labels:   "DM Sans" Light 300, uppercase, letter-spacing 0.15em
Accent (лого only):  "Cormorant Garamond" — только для логотипа и pull quotes
```

### Сетка
- Desktop: 12-column grid, max-width 1440px
- Tablet: 8-column, 768–1024px
- Mobile: 4-column, 320–767px (mobile-first)

---

## АРХИТЕКТУРА САЙТА

```
/                   → Home (Hero + 360° бутылка + Brand Story + CTA)
/wines              → Коллекция (каталог с фильтрами)
  /wines/[slug]     → Страница каждого вина (3D viewer, tech sheet, pairing)
/estate             → Поместье (история, виноградник, команда)
/trade              → B2B Portal 🔐 (для партнёров)
/experiences        → Дегустации, туры, события
/news               → Новости, урожай, пресса
/contact            → Контакт (разные формы для B2B и B2C)
```

---

## ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ

### 1. 360° Spinning Bottle — HERO FEATURE

**Технология**: Three.js + WebGL + GLTF/GLB 3D модель

**Функционал**:
- Плавное авто-вращение при загрузке страницы (auto-spin)
- Остановка и ручное вращение при взаимодействии мыши/тача
- Реалистичное стекло с отражением (PBR материалы)
- Переключение между бутылками коллекции
- При зуме — видна этикетка в деталях
- На мобиле — управление гироскопом (наклон телефона)

**Производительность**:
- LOD (Level of Detail) — низкополигональная модель для мобиле
- Lazy-load 3D движка
- Fallback: статичное фото для старых браузеров

**Расположение**:
- Главная страница — hero section (правая половина экрана)
- Страница каждого вина — полный интерактивный просмотр

### 2. Scroll-triggered Animations (GSAP + ScrollTrigger)
- Виноградник появляется по мере скролла (parallax)
- Бутылка "наливает" вино при скролле вниз
- Текст появляется построчно
- Карта поместья рисуется при скролле

### 3. Hover Microinteractions
- Карточки вин — magnetic hover effect
- Кнопки — жидкий fill эффект
- Навигация — подчёркивание рисуется

### 4. Vineyard Interactive Map
- SVG карта поместья с точками интереса
- Клик на участок → информация о сорте, возрасте лозы

---

## СТРАНИЦЫ — ДЕТАЛЬНЫЙ ПЛАН

### HOME (Главная)

**Section 1 — Hero (fullscreen)**
- Левая половина: Заголовок + Tagline + 2 CTA кнопки
  - "Explore Wines" → /wines
  - "Trade Portal" → /trade
- Правая половина: 3D Spinning Bottle (Three.js)
- Фон: тёмный + texture overlay (Tuscan stone)
- Auto-play видео loop (muted) за 3D сценой

**Section 2 — Brand Statement**
- 1–2 предложения о бренде, крупно
- Год основания / локация / философия

**Section 3 — Wine Collection Preview**
- Горизонтальный скролл карточек
- Каждая карточка: фото, название, vintage, CTA

**Section 4 — The Estate**
- Fullwidth фото виноградника
- Краткая история + link

**Section 5 — For Trade Partners**
- Dark section с золотыми деталями
- CTA для регистрации в B2B портале

**Section 6 — Latest News**
- 3 последние статьи / vintage reports

**Section 7 — Footer**
- Логотип, навигация, соцсети, контакты

---

### WINE PAGE (Страница вина)

**Верхняя часть (split layout)**
- Левая: 3D Bottle Viewer (интерактивный, 360°)
- Правая: Название, vintage, тип, описание

**Вкладки (tabs)**
- Дегустационные заметки (аромат / вкус / послевкусие)
- Технические параметры (алкоголь, кислотность, pH, выдержка)
- Паринг с едой (иконки блюд + описание)
- Vintage Notes (по годам — таймлайн)
- Рейтинги (Wine Spectator, Vivino, James Suckling)

**Download Tech Sheet** — PDF кнопка

**Related Wines** — секция "вам также понравится"

---

### TRADE PORTAL (B2B — защищённая зона)

**Регистрация**
- Форма для новых партнёров (тип: ресторан / ритейл / импортёр / дистрибутор)
- Верификация (ручная + email подтверждение)

**После входа — Dashboard**
- Актуальное наличие по позициям
- Персональный прайс-лист
- История заказов
- Скачать: Tech Sheets, POS Assets, High-res Photos
- Vintage Reports (PDF)
- Sommelier Training Materials (видео + PDF)
- Allocation Tracker (live — сколько осталось)

**Контакт с менеджером**
- Встроенный чат или форма запроса на встречу

---

### ESTATE (Поместье)

- Parallax hero с drone video
- Интерактивная карта виноградника (SVG)
- Timeline истории с 1820
- Галерея фото по сезонам
- Портреты команды (hover — имя + роль)

---

## ТЕХНИЧЕСКИЙ СТЕК

### Frontend
```
Framework:      Next.js 15 (App Router, SSR/SSG)
Styling:        Tailwind CSS + CSS Custom Properties
3D:             Three.js + React Three Fiber + Drei
Animations:     GSAP + ScrollTrigger
UI Components:  Radix UI (доступность)
Forms:          React Hook Form + Zod
i18n:           next-intl (EN / IT / RU / DE)
```

### Backend & CMS
```
CMS:            Sanity.io v3  ← КЛЮЧЕВОЙ ВЫБОР (см. ниже)
Auth (B2B):     NextAuth.js + Sanity roles
Database:       Sanity (document store) + Edge Config (Vercel)
Email:          Resend (транзакционные письма)
Search:         Algolia (поиск по винам)
```

### Инфраструктура
```
Hosting:        Vercel (auto-deploy от GitHub)
CDN:            Vercel Edge Network
Images:         Sanity CDN + next/image
Video:          Mux (видео стриминг)
Analytics:      Plausible (GDPR-friendly)
```

---

## ИНСТРУМЕНТ УПРАВЛЕНИЯ КОНТЕНТОМ (CMS)

> **На финальном этапе реализации клиент получает полноценную CMS систему для самостоятельного управления сайтом без разработчика.**

### Выбранное решение: Sanity.io

**Почему Sanity:**
- Визуальный редактор — клиент редактирует прямо на сайте (Visual Editing)
- Не нужно знать программирование — интерфейс как Google Docs
- Real-time preview — видишь изменения до публикации
- Мобильное приложение Sanity Studio
- Бесплатный тариф (до 3 пользователей, 10GB)

### Что клиент сможет делать самостоятельно

#### Контент сайта
- ✅ Редактировать любой текст на любой странице
- ✅ Менять заголовки, описания, цитаты
- ✅ Загружать и заменять фотографии (авто-оптимизация)
- ✅ Добавлять новые вина в каталог (форма с полями)
- ✅ Обновлять vintage (год урожая), характеристики, рейтинги
- ✅ Писать новые статьи / vintage reports
- ✅ Управлять событиями и дегустациями
- ✅ Обновлять контактную информацию

#### B2B Portal
- ✅ Добавлять/удалять партнёров
- ✅ Загружать новые Tech Sheets (PDF)
- ✅ Обновлять прайс-листы
- ✅ Загружать маркетинговые материалы для ритейлеров

#### Медиа
- ✅ Загрузка фото с телефона или компьютера
- ✅ Управление галереями
- ✅ Добавление видео (через Mux integration)

### Интерфейс для клиента (Sanity Studio)

```
Sanity Studio (studio.labanditawine.com)
│
├── Wines (Вина)
│   ├── + Добавить вино
│   └── [список вин] → клик → редактор
│
├── Pages (Страницы)
│   ├── Home
│   ├── Estate
│   └── Contact
│
├── News (Новости)
│   └── + Новая статья
│
├── Trade Assets (B2B материалы)
│   ├── Tech Sheets
│   └── POS Materials
│
└── Settings
    ├── Контактная информация
    ├── Социальные сети
    └── SEO настройки
```

### Обучение клиента
- **30-минутный onboarding call** — обзор интерфейса
- **Видео-инструкции** (Loom) для каждого типа задачи
- **Документация** на русском / итальянском
- **Email поддержка** первые 3 месяца

---

## ЭТАПЫ РЕАЛИЗАЦИИ

### Фаза 1: Дизайн (3–4 недели)
- [ ] Moodboard и visual direction (на основе этикеток)
- [ ] Wireframes всех страниц (Figma)
- [ ] UI Design System (colors, type, components)
- [ ] High-fidelity дизайн ключевых страниц
- [ ] Мобильные версии
- [ ] Прототип с анимациями
- [ ] Брендбук (параллельно)

### Фаза 2: 3D и визуальный контент (2–3 недели)
- [ ] Создание 3D модели бутылок (GLB формат) или фотограмметрия
- [ ] Разработка 360° viewer на Three.js
- [ ] Фотосессия (если нужна новая)
- [ ] Видео-съёмка / drone footage

### Фаза 3: Разработка — Frontend (4–5 недель)
- [ ] Setup: Next.js + Tailwind + Three.js
- [ ] Компоненты: Header, Footer, Navigation
- [ ] Страницы: Home, Wines, Estate, Contact
- [ ] 360° Bottle Viewer интеграция
- [ ] Анимации GSAP
- [ ] Адаптивность (mobile-first)

### Фаза 4: Backend + CMS (3–4 недели)
- [ ] Sanity Studio настройка схем (Wines, Pages, News...)
- [ ] Миграция существующего контента
- [ ] B2B Portal (auth, защищённые маршруты)
- [ ] Формы обратной связи
- [ ] Email уведомления

### Фаза 5: Тестирование и запуск (1–2 недели)
- [ ] Кросс-браузерное тестирование
- [ ] Performance audit (Lighthouse ≥ 90)
- [ ] SEO аудит
- [ ] Онбординг клиента в CMS
- [ ] Soft launch → Hard launch

**Итого: ~13–18 недель (3–4.5 месяца)**

---

## PERFORMANCE ЦЕЛИ

| Метрика | Цель |
|---|---|
| Lighthouse Performance | ≥ 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3.5s |
| Mobile Score | ≥ 85 |

---

## SEO СТРАТЕГИЯ

- Структурированные данные (Schema.org: Product, LocalBusiness, WineryProduct)
- Sitemap.xml авто-генерация
- Hreflang для мультиязычных версий
- Open Graph для социальных сетей
- Ключевые слова: "Tuscan wine B2B", "Suvereto wine wholesale", "IGT Toscana importer", "La Bandita wine trade"

---

## БЮДЖЕТ (ориентировочно)

| Статья | Диапазон |
|---|---|
| Дизайн (UI/UX + Брендбук) | €8,000–15,000 |
| 3D модель бутылок | €1,500–3,000 |
| Frontend разработка | €12,000–20,000 |
| Backend + CMS | €5,000–8,000 |
| B2B Portal | €4,000–7,000 |
| Фотосессия / видео | €3,000–8,000 |
| Итого | **€33,500–61,000** |

*Ежемесячные расходы: Vercel Pro ~$20, Sanity Free/Growth ~$0–99, Mux ~$50*

---

*Документ подготовлен: Апрель 2026*
*Версия 1.0 — подлежит уточнению после встречи с клиентом*
