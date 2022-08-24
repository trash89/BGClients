drop POLICY if exists "pol_localusers" on public.localusers;
drop POLICY if exists "pol_localusers_select" on public.localusers;
drop POLICY if exists "pol_localusers_insert" on public.localusers;
drop POLICY if exists "pol_clients_insert" on public.clients;
drop POLICY if exists "pol_clients_update" on public.clients;
drop POLICY if exists "pol_clients_delete" on public.clients;
drop POLICY if exists "pol_clients_select" on public.clients;
drop POLICY if exists "clients_select" on public.clients;

GRANT SELECT,update ON table auth.users to authenticated;

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

CREATE POLICY "pol_clients_insert"
ON public.clients
FOR INSERT
TO authenticated 
WITH CHECK (true);

CREATE POLICY "pol_clients_update"
ON public.clients
FOR UPDATE
using (true);

CREATE POLICY "pol_clients_delete"
ON public.clients
FOR DELETE USING(true);


CREATE POLICY "pol_clients_select"
ON public.clients
FOR SELECT USING (
  true
);

CREATE POLICY "Give users access to own folder aumbjm_0" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'clientsbucket' AND auth.uid()::text = (storage.foldername(name))[1]);

    // "proxy": "http://localhost:5000"