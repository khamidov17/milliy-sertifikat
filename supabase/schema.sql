-- ============================================================================
-- Milliy Sertifikat — Supabase (PostgreSQL) sxemasi
-- Supabase SQL Editor'da bir marta ishga tushiring (yoki `supabase db push`).
-- Auth: Supabase Auth (auth.users) — foydalanuvchilar shu yerda; biz `profiles`
-- jadvalini bog'laymiz. Sessiyalar Supabase tomonidan boshqariladi.
-- Xavfsizlik: savollar/javoblar mijozga OCHILMAYDI — faqat server (service_role)
-- o'qiydi va serverda baholaydi. RLS backstop sifatida.
-- ============================================================================

-- ── Profillar (auth.users bilan bog'langan) ──
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  ism         text not null default '',
  familiya    text not null default '',
  username    text unique,
  rol         text not null default 'student' check (rol in ('student','teacher','admin')),
  region      text,
  created_at  timestamptz not null default now()
);

-- Ro'yxatdan o'tganda profil avtomatik yaratiladi
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, ism, familiya, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'ism', ''),
    coalesce(new.raw_user_meta_data->>'familiya', ''),
    new.raw_user_meta_data->>'username'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Savollar banki ──
create table if not exists public.questions (
  id           bigserial primary key,
  manba_kod    text,
  fan          text not null default 'matematika',
  bob          text,
  mavzu        text not null,
  qiyinchilik  text,
  matn         text not null,
  rasm         text,
  variantlar   jsonb not null,           -- ["A matn","B matn",...] (4-5 ta)
  togri        text not null,            -- 'A'..'E'  (mijozga ochilmaydi)
  izoh         text default '',
  holat        text not null default 'chop_etilgan',
  created_at   timestamptz not null default now()
);
create index if not exists idx_questions_mavzu on public.questions(mavzu);
create index if not exists idx_questions_fan   on public.questions(fan);

-- ── Sinov imtihonlari ──
create table if not exists public.mock_exams (
  id                bigserial primary key,
  nomi              text not null,
  tavsif            text default '',
  turi              text not null default 'mini',
  davomiylik_daqiqa int  not null,
  boshlanish_at     timestamptz,
  tugash_at         timestamptz,
  created_by        uuid references public.profiles(id) on delete set null,
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

create table if not exists public.mock_questions (
  mock_id      bigint not null references public.mock_exams(id) on delete cascade,
  question_id  bigint not null references public.questions(id) on delete cascade,
  tartib       int not null,
  primary key (mock_id, question_id)
);
create index if not exists idx_mockq_mock on public.mock_questions(mock_id, tartib);

-- ── Urinishlar (attempts) + har bir javob ──
create table if not exists public.attempts (
  id          bigserial primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  turi        text not null,             -- 'mavzu' | 'kurs' | 'mock'
  mock_id     bigint references public.mock_exams(id) on delete set null,
  nomi        text,
  jami        int not null,
  togri       int not null,
  ball        int not null,
  davomiylik  int not null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_attempts_user on public.attempts(user_id, created_at desc);
create index if not exists idx_attempts_mock on public.attempts(mock_id);

create table if not exists public.attempt_answers (
  id          bigserial primary key,
  attempt_id  bigint not null references public.attempts(id) on delete cascade,
  question_id bigint not null references public.questions(id) on delete cascade,
  tanlangan   text,
  togri       boolean not null,
  sekund      int not null default 0
);
create index if not exists idx_answers_attempt on public.attempt_answers(attempt_id);

-- ============================================================================
-- RLS (Row-Level Security)
-- ============================================================================
alter table public.profiles        enable row level security;
alter table public.questions       enable row level security;
alter table public.mock_exams      enable row level security;
alter table public.mock_questions  enable row level security;
alter table public.attempts        enable row level security;
alter table public.attempt_answers enable row level security;

-- profiles: har kim (autentifikatsiyalangan) o'qiy oladi (reyting uchun), faqat o'zini yangilaydi
create policy "profiles_select" on public.profiles for select to authenticated using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

-- mock_exams: metadata autentifikatsiyalanganlarga ochiq (javoblar bu yerda emas)
create policy "mocks_select" on public.mock_exams for select to authenticated using (active);

-- questions, mock_questions: MIJOZGA OCHILMAYDI (togri javob bor).
--   Faqat server service_role o'qiydi (RLS ni chetlab o'tadi). Hech qanday policy bermaymiz.
--   Admin/teacher boshqaruvi ham server orqali (service_role) amalga oshadi.

-- attempts: foydalanuvchi faqat o'zinikini ko'radi/qo'shadi
create policy "attempts_select_own" on public.attempts for select to authenticated using (auth.uid() = user_id);
create policy "attempts_insert_own" on public.attempts for insert to authenticated with check (auth.uid() = user_id);

-- attempt_answers: faqat o'z urinishlari
create policy "answers_select_own" on public.attempt_answers for select to authenticated
  using (exists (select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid()));
create policy "answers_insert_own" on public.attempt_answers for insert to authenticated
  with check (exists (select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid()));

-- Eslatma: savol berish/baholash server action'larda service_role bilan bajariladi,
-- shuning uchun questions/attempt_answers ga yozishda ham server ishlatiladi.
