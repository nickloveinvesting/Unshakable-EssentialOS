# Unshakable EssentialOS — Deal Analyzer

Fix & flip deal analyzer for The Unshakable Investor (Legacy Essential / $997 offer).
React + Vite web app with Supabase auth and cloud-saved deals.

## Stack
- Vite + React 18
- Tailwind CSS (real build — no CDN)
- Supabase (auth + `deals` table with Row-Level Security)
- lucide-react icons
- Deployed on Vercel

## Local development

```bash
npm install
# create your local env file from the example, then fill in the key
cp .env.example .env
npm run dev      # http://localhost:5173
```

`.env` is git-ignored. It needs:

```
VITE_SUPABASE_URL=https://vxqutztrxdejqcqazlgt.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...   # the PUBLISHABLE key (safe in client)
```

## Push to GitHub (repo: nickloveinvesting/Unshakable-EssentialOS)

From inside this folder:

```bash
git init
git add .
git commit -m "Initial EssentialOS web app (Vite + React + Supabase)"
git branch -M main
git remote add origin https://github.com/nickloveinvesting/Unshakable-EssentialOS.git
git push -u origin main
```

(`node_modules`, `dist`, and `.env` are excluded by `.gitignore`.)

## Connect Vercel

1. Vercel → Add New → Project → import `Unshakable-EssentialOS`.
2. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
3. Add Environment Variables (Settings → Environment Variables), for Production + Preview:
   - `VITE_SUPABASE_URL` = `https://vxqutztrxdejqcqazlgt.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = the publishable key
4. Deploy. Every future `git push` auto-deploys.

## Supabase notes
- Project: **Unshakable EssentialOS** (`vxqutztrxdejqcqazlgt`).
- Table `deals` with RLS — each user only sees their own. Auto-created `profiles` not used yet.
- **Auth → Providers → Email:** decide whether "Confirm email" is on. If on, members must click a confirmation email before first sign-in. For manual member creation, add users in Auth → Users with "Auto Confirm."
- **Auth → URL Configuration:** set Site URL to your Vercel domain once deployed.
- After launch, rotate any secret keys that were shared during setup.

## Project structure
```
index.html          # entry + fonts + loading splash
src/main.jsx        # React root render
src/App.jsx         # entire app (components, hooks, calc engine, Supabase client)
src/index.css       # Tailwind directives + custom brand styles
.env.example        # env var template
```
