-- Migration 007: AI marking of handwritten working (prototype).
-- Run once in Supabase → SQL Editor (safe to run again).
--
-- written_marks  one row per marked answer: score, the full case report, and where the image is stored.
-- written-work   private storage bucket for the images, one folder per student.
--
-- Only the mark-written Edge Function writes here (it uses the service key). Students can read their own
-- rows and images; nobody can read anyone else's. Teacher access comes later with the schools version.

create table if not exists public.written_marks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  topic text,
  image_path text,
  status text not null,               -- marked | unreadable | blank | wrong_question | check
  score int,
  max_marks int,
  result jsonb not null,              -- the full case report shown to the student
  needs_review boolean not null default false,
  disputed boolean not null default false,
  dispute_note text,
  disputed_at timestamptz,
  teacher_score int,                  -- set when you (or later a teacher) re-mark it by hand
  teacher_note text,
  model text,
  input_tokens int,
  output_tokens int,
  ms int,
  created_at timestamptz not null default now()
);
create index if not exists written_marks_user_day on public.written_marks (user_id, created_at desc);
create index if not exists written_marks_review on public.written_marks (created_at desc) where needs_review or disputed;

alter table public.written_marks enable row level security;
drop policy if exists "read own written marks" on public.written_marks;
create policy "read own written marks" on public.written_marks for select using (auth.uid() = user_id);

-- Private bucket: images are never public
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('written-work', 'written-work', false, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false;

drop policy if exists "read own written work" on storage.objects;
create policy "read own written work" on storage.objects for select
  using (bucket_id = 'written-work' and (storage.foldername(name))[1] = auth.uid()::text);

-- Data retention: images are only needed for disputes and for checking the marking. The mark-written
-- function deletes images older than 90 days (the score and case report stay) when it is called with
-- {"action":"purge"} and the PURGE_KEY secret. Supabase doesn't allow deleting storage files from SQL,
-- which is why this lives in the function rather than here.
