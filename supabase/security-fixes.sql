-- ============================================================================
-- Xavfsizlik tuzatishlari — Supabase SQL Editor'da bir marta ishga tushiring.
-- C2: foydalanuvchi o'z rolini admin qila olmasligi uchun.
-- H1: profillar PII barcha foydalanuvchilarga ochiq bo'lmasligi uchun.
-- ============================================================================

-- ── C2: profiles.rol / id / username ustunlarini klient yangilashidan qulflash ──
-- RLS ustun darajasida cheklolmaydi, shuning uchun trigger ishlatamiz.
create or replace function public.lock_profile_privileged_cols()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- service_role (server) bemalol o'zgartiradi; oddiy foydalanuvchi rad etiladi
  if auth.role() = 'service_role' then
    return new;
  end if;
  if new.rol is distinct from old.rol
     or new.id is distinct from old.id
     or new.username is distinct from old.username then
    raise exception 'Bu maydonlarni o''zgartirib bo''lmaydi';
  end if;
  return new;
end $$;

drop trigger if exists t_lock_profile_privcols on public.profiles;
create trigger t_lock_profile_privcols
  before update on public.profiles
  for each row execute function public.lock_profile_privileged_cols();

-- ── H1: profillar SELECT siyosatini faqat o'zi bilan cheklash ──
-- (Reyting kelajakda faqat non-PII qaytaruvchi RPC/view orqali beriladi.)
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);
