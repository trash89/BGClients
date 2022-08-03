drop POLICY if exists "pol_localusers" on public.localusers;

CREATE POLICY "pol_localusers"
ON public.localusers
FOR ALL USING (
         auth.uid() = user_id
);