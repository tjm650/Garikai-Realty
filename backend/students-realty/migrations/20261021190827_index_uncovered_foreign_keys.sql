CREATE INDEX IF NOT EXISTS bookings_conversation_id_idx ON public.bookings (conversation_id);
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS whatsapp_messages_conversation_id_idx ON public.whatsapp_messages (conversation_id);