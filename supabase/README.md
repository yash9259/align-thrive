Supabase setup for AlignThrive

1) In Supabase project, open SQL Editor and run schema.sql from this folder.
2) Enable Email auth (or your preferred auth provider).
3) Copy .env.example to .env and set:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4) Start app with npm run dev.

Realtime chat notes
- Table: public.messages
- Live updates: Supabase Realtime is enabled by adding messages to supabase_realtime publication in schema.sql.
- Sender/receiver separation:
  - sender_id = auth user sending message
  - receiver_id = auth user receiving message
  - conversation_key is generated automatically from sender_id/receiver_id pair.

Required storage buckets in schema.sql
- chat-attachments
- creator-content
- brand-assets
- avatars

Important
- RLS is enabled on all major tables.
- Do not use service role key in frontend env.
- Use anon key only in Vite client.
