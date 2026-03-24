-- Galaxy Todo: Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create todos table
create table if not exists public.todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  due_date date,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  category text,
  completed boolean default false,
  sort_order integer default 0,
  calendar_event_id text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.todos enable row level security;

-- Allow anonymous access (for demo — tighten for prod)
create policy "Allow all access" on public.todos
  for all using (true) with check (true);
