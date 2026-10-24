REVOKE EXECUTE ON FUNCTION public.record_successful_payment(uuid,uuid,numeric,text,text,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_successful_payment(uuid,uuid,numeric,text,text,text,jsonb) TO service_role;
REVOKE EXECUTE ON FUNCTION public.submit_provider_insights(uuid,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_provider_insights(uuid,text,jsonb) TO service_role;