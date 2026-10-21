DO $migration$
DECLARE
  v_definition text;
  v_old text := 'if auth.uid() is null or auth.uid()<>p_provider_user_id then raise exception ''not authorized''; end if;';
  v_new text := 'if coalesce(auth.jwt()->>''role'','''') <> ''service_role'' and (auth.uid() is null or auth.uid()<>p_provider_user_id) then raise exception ''not authorized''; end if;';
BEGIN
  v_definition := pg_get_functiondef('public.provider_booking_response(uuid,uuid,text,text)'::regprocedure);
  IF position(v_old in v_definition) = 0 THEN
    RAISE EXCEPTION 'Expected provider authorization guard not found; migration stopped';
  END IF;
  EXECUTE replace(v_definition, v_old, v_new);
END
$migration$;