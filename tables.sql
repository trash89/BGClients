drop POLICY if exists "pol_localusers" on public.localusers;
drop POLICY if exists "pol_localusers_select" on public.localusers;
drop POLICY if exists "pol_localusers_insert" on public.localusers;

GRANT SELECT ON table auth.users to authenticated;

CREATE POLICY "pol_localusers_select"
ON public.localusers
FOR SELECT USING (
         auth.uid() = user_id
);

CREATE POLICY "pol_localusers_insert"
ON public.localusers
FOR insert with check (
          user_id in (select id from auth.users)
);

