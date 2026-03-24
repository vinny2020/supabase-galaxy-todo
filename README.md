# ✦ Galaxy Todo

A cosmic todo app built with **Next.js 15**, **Supabase**, and styled with the **Midnight Galaxy** theme.

## Features

- **CRUD Todos** — Add, edit, delete tasks
- **Priority levels** — Low, Medium, High, Urgent with color-coded badges
- **Categories** — Work, Personal, Health, Finance, Learning
- **Drag-and-drop reorder** — Powered by @dnd-kit
- **Google Calendar integration** — Add due-date todos as calendar events

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Supabase** (PostgreSQL, Row Level Security)
- **Tailwind CSS v4** (Midnight Galaxy custom theme)
- **@dnd-kit** (drag-and-drop)
- **Vercel** (deployment)

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Create a Supabase project at [supabase.com](https://supabase.com)

3. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor

4. Copy `.env.local.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.local.example .env.local
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

## Midnight Galaxy Theme

| Color          | Hex       |
|----------------|-----------|
| Deep Purple    | `#2b1e3e` |
| Cosmic Blue    | `#4a4e8f` |
| Lavender       | `#a490c2` |
| Silver         | `#e6e6fa` |
