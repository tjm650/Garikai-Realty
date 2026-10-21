CREATE OR REPLACE FUNCTION public.submit_provider_insights(p_provider_id uuid, p_property_no text, p_insights jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_property public.properties%rowtype;
  v_updated text[] := '{}';
  v_items jsonb;
  v_provider_user_id uuid;
begin
  IF coalesce(auth.jwt()->>'role','') <> 'service_role' THEN
    IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authorized'; END IF;
    SELECT user_id INTO v_provider_user_id FROM public.providers WHERE id = p_provider_id;
    IF v_provider_user_id IS NULL OR v_provider_user_id <> auth.uid() THEN RAISE EXCEPTION 'not authorized for provider'; END IF;
  END IF;
  SELECT * INTO v_property FROM public.properties p
  WHERE p.provider_id = p_provider_id
    AND upper(p.property_no) = CASE WHEN length(replace(upper(p_property_no),'-','')) = 6
      THEN left(replace(upper(p_property_no),'-',''),2)||'-'||right(replace(upper(p_property_no),'-',''),4)
      ELSE upper(p_property_no) END FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'message','Property not found for this provider','updated_fields',jsonb_build_array()); END IF;
  IF p_insights ? 'gender_preference' AND nullif(p_insights->>'gender_preference','') IS NOT NULL THEN
    UPDATE public.properties SET gender_preference=p_insights->>'gender_preference',updated_at=now() WHERE id=v_property.id;
    v_updated:=array_append(v_updated,'gender_preference');
  END IF;
  IF p_insights ? 'total_rooms' THEN BEGIN
    UPDATE public.properties SET total_rooms=(p_insights->>'total_rooms')::integer,updated_at=now() WHERE id=v_property.id;
    v_updated:=array_append(v_updated,'total_rooms');
  EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN NULL; END; END IF;
  IF p_insights ? 'available_rooms' THEN BEGIN
    UPDATE public.properties SET available_rooms=(p_insights->>'available_rooms')::integer,is_available=((p_insights->>'available_rooms')::integer>0),availability_updated_at=now(),updated_at=now() WHERE id=v_property.id;
    v_updated:=array_append(v_updated,'available_rooms');
  EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN NULL; END; END IF;
  v_items:=p_insights->'available_slots';
  IF jsonb_typeof(v_items)='object' THEN
    IF v_items ? '1h/room' THEN UPDATE public.properties SET available_1h_rooms=(v_items->>'1h/room')::integer,updated_at=now() WHERE id=v_property.id; v_updated:=array_append(v_updated,'available_1h_rooms'); END IF;
    IF v_items ? '2h/room' THEN UPDATE public.properties SET available_2h_rooms=(v_items->>'2h/room')::integer,updated_at=now() WHERE id=v_property.id; v_updated:=array_append(v_updated,'available_2h_rooms'); END IF;
    IF v_items ? '3h/room' THEN UPDATE public.properties SET available_3h_rooms=(v_items->>'3h/room')::integer,updated_at=now() WHERE id=v_property.id; v_updated:=array_append(v_updated,'available_3h_rooms'); END IF;
    IF v_items ? '4h/room' THEN UPDATE public.properties SET available_4h_rooms=(v_items->>'4h/room')::integer,updated_at=now() WHERE id=v_property.id; v_updated:=array_append(v_updated,'available_4h_rooms'); END IF;
  END IF;
  IF jsonb_typeof(p_insights->'amenities')='array' THEN
    UPDATE public.properties SET amenities=(SELECT coalesce(jsonb_agg(DISTINCT x),'[]'::jsonb) FROM jsonb_array_elements(coalesce(amenities,'[]'::jsonb)||(p_insights->'amenities')) x),updated_at=now() WHERE id=v_property.id;
    v_updated:=array_append(v_updated,'amenities');
  END IF;
  v_items:=p_insights->'pricing';
  IF jsonb_typeof(v_items)='object' THEN
    IF v_items ? 'price/term' THEN UPDATE public.properties SET price_per_semester=(v_items->>'price/term')::numeric,updated_at=now() WHERE id=v_property.id; v_updated:=array_append(v_updated,'price_per_semester'); END IF;
    IF v_items ? 'price/month' THEN UPDATE public.properties SET price_per_month=(v_items->>'price/month')::numeric,updated_at=now() WHERE id=v_property.id; v_updated:=array_append(v_updated,'price_per_month'); END IF;
    IF v_items ? 'price/week' THEN UPDATE public.properties SET price_per_week=(v_items->>'price/week')::numeric,updated_at=now() WHERE id=v_property.id; v_updated:=array_append(v_updated,'price_per_week'); END IF;
    IF v_items ? 'price/day' THEN UPDATE public.properties SET price_per_day=(v_items->>'price/day')::numeric,updated_at=now() WHERE id=v_property.id; v_updated:=array_append(v_updated,'price_per_day'); END IF;
  END IF;
  IF cardinality(v_updated)=0 THEN RETURN jsonb_build_object('success',false,'message','No valid fields to update','updated_fields',jsonb_build_array()); END IF;
  RETURN jsonb_build_object('success',true,'message','Property updated','updated_fields',to_jsonb(v_updated));
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.append_conversation_message(uuid,text,text,text,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.append_conversation_message(uuid,text,text,text,jsonb) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.confirm_booking_after_payment(uuid,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_booking_after_payment(uuid,uuid) TO service_role;
REVOKE EXECUTE ON FUNCTION public.consume_search_entitlement(uuid,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_search_entitlement(uuid,jsonb) TO service_role;
REVOKE EXECUTE ON FUNCTION public.create_booking_request(uuid,uuid,text,text,date,date,text,numeric,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_booking_request(uuid,uuid,text,text,date,date,text,numeric,text) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.provider_booking_response(uuid,uuid,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.provider_booking_response(uuid,uuid,text,text) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.record_successful_payment(uuid,uuid,numeric,text,text,text,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_successful_payment(uuid,uuid,numeric,text,text,text,jsonb) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.submit_provider_insights(uuid,text,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_provider_insights(uuid,text,jsonb) TO authenticated, service_role;
REVOKE ALL ON TABLE public.conversation_security_events, public.whatsapp_events, public.whatsapp_messages FROM anon, authenticated;
REVOKE SELECT ON TABLE public.bookings, public.conversation_messages, public.conversations, public.profiles, public.transactions FROM anon;