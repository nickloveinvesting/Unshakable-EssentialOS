# Supabase Backend — EssentialOS

**Project:** Unshakable EssentialOS · `vxqutztrxdejqcqazlgt` · region `us-west-2` · Postgres 17
**API URL:** `https://vxqutztrxdejqcqazlgt.supabase.co`

The app authenticates members and stores their saved deals. Each user can only
read or write their own deals — enforced at the database with Row-Level Security,
not just in the app.

## Auth
- Provider: Email (email + password).
- Members are created manually (Supabase dashboard → Authentication → Users) or
  via the in-app "Create account" form.
- If "Confirm email" is enabled, a member must confirm via email before first
  sign-in. For manual creation, use "Auto Confirm."
- Set **Site URL** (Auth → URL Configuration) to the deployed Vercel domain.

## Table: `deals`
| column | type | notes |
|---|---|---|
| id | uuid (pk) | `gen_random_uuid()` |
| user_id | uuid | FK → `auth.users(id)` on delete cascade |
| deal_name | text | required |
| address | text | list display |
| arv | numeric | list display |
| purchase_price | numeric | |
| net_profit | numeric | |
| verdict | text | BUY / WAIT / KILL |
| inputs | jsonb | the full deal state object |
| result | jsonb | computed metrics + 20-metric score |
| created_at | timestamptz | `now()` |
| updated_at | timestamptz | maintained by trigger |

## Indexes
- `deals_user_id_idx` on `(user_id)` — FK columns are not auto-indexed.
- `deals_user_created_idx` on `(user_id, created_at desc)` — powers the
  "my deals, newest first" list as an index-only scan.

## Row-Level Security
Enabled, scoped to the `authenticated` role, using the performance-optimized
`(select auth.uid())` pattern:

```sql
create policy "deals_select_own" on public.deals for select to authenticated using ((select auth.uid()) = user_id);
create policy "deals_insert_own" on public.deals for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "deals_update_own" on public.deals for update to authenticated using ((select auth.uid()) = user_id);
create policy "deals_delete_own" on public.deals for delete to authenticated using ((select auth.uid()) = user_id);
```

## Trigger
`on_deals_updated` runs `public.touch_updated_at()` before every update to keep
`updated_at` current.

## Client wiring
The app reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (publishable key —
safe in the browser; RLS protects the data) and creates the client in
`src/App.jsx`. Saved-deal CRUD lives in the `useSavedDeals` hook.
