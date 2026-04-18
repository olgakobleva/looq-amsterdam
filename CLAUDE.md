# La Bandita Wine — Project Context

## Проект
Новый сайт для тосканской винодельни La Bandita Wine (labanditawine.com).
Расположение: Suvereto, провинция Ливорно, Тоскана. Основана в 1820.
Вина: Podere La Bandita (Cab Sauv + Merlot + Cab Franc), Milia (Merlot + Cab Sauv).

## Технический стек
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + CSS Custom Properties
- **3D**: Three.js + React Three Fiber + Drei
- **Animations**: GSAP + ScrollTrigger
- **CMS**: Sanity.io v3
- **Auth**: NextAuth.js (для B2B портала)
- **Email**: Resend
- **Hosting**: Vercel

## Цветовая палитра
```
--burgundy:   #5C1A1A
--gold:       #C9A84C
--parchment:  #F5EED8
--charcoal:   #1C1C1E
--terracotta: #A0522D
--cream:      #FAF6EE
```

## Типографика
- Display/Hero: DM Sans (700)
- Body: Inter (400), 16px, line-height 1.75
- Accent/Logo: Cormorant Garamond (только логотип и pull quotes)

## Структура папок
```
/app              — Next.js App Router страницы
/components       — переиспользуемые компоненты
/components/3d    — Three.js компоненты
/sections         — секции страниц (Hero, About и т.д.)
/lib              — утилиты, запросы Sanity, токены
/studio           — Sanity Studio
/public/models    — 3D модели (.glb)
/public/images    — статичные изображения
```

## Команда агентов

### 🏗️ DevOps Agent
Отвечает за: CI/CD, деплой, окружения, Docker, мониторинг, безопасность.
Вызов: `/devops`

### 🧪 QA Agent  
Отвечает за: тесты (unit/e2e), accessibility, performance, visual regression.
Вызов: `/qa`

### 💻 Dev Agent (основной)
Отвечает за: компоненты, страницы, CMS схемы, 3D, анимации.
Вызов: по умолчанию

## Правила для всех агентов
- Не добавлять фичи сверх задания
- Не создавать README или документацию без запроса
- Комментарии только если логика неочевидна
- Mobile-first подход
- Каждый компонент — отдельный файл
- Никогда не коммитить .env файлы
