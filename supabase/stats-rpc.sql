-- Dashboard "umumiy" ko'rsatkichlari uchun aniq (barcha urinishlar bo'yicha) yig'indi.
-- Supabase SQL Editor'da bir marta ishga tushiring.
-- auth.uid() ishlatadi — foydalanuvchi faqat O'Z statistikasini oladi (xavfsiz).

create or replace function public.foydalanuvchi_stat()
returns table (urinishlar bigint, jami_savol bigint, jami_togri bigint, jami_vaqt bigint)
language sql stable security definer set search_path = public as $$
  select
    count(*)::bigint,
    coalesce(sum(jami), 0)::bigint,
    coalesce(sum(togri), 0)::bigint,
    coalesce(sum(davomiylik), 0)::bigint
  from public.attempts
  where user_id = auth.uid();
$$;
