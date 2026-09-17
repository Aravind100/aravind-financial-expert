# Aravind Financial Website

Next.js + Supabase + Vercel financial-services website.

## Supabase environment variables

Set these in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server only)
- `ADMIN_EMAIL` = `aravindchaudhary90@gmail.com`

The legacy `SUPABASE_SERVICE_ROLE_KEY` is still accepted by the lead-insert API as a fallback during migration.

## Admin dashboard

- `/admin/login` uses Supabase email/password authentication.
- `/admin` is protected by the authenticated Supabase user.
- Only `ADMIN_EMAIL` is authorized to view leads.
- `/api/admin/leads` verifies the authenticated user before reading the leads table.
- The Supabase secret key is never sent to the browser.

## Existing lead flow

Website enquiry form → `/api/leads` → Supabase `public.leads` table.
