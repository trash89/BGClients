CREATE POLICY "pol_objects" ON "storage"."objects"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "pol_objects" ON "storage"."buckets"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);