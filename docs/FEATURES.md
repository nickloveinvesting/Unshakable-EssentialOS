# EssentialOS — Feature Overview

**EssentialOS** (The Unshakable Deal Analyzer) is the fix-and-flip underwriting tool for
The Unshakable Investor's Legacy Essential members. It replaces the fix-and-flip
spreadsheet: enter a deal, and it estimates rehab, models exit strategies, stress-tests
the numbers, and returns a clear **BUY / WAIT / KILL** verdict — with every deal saved to
the member's account.

- **Live app:** unshakable-essential-os.vercel.app
- **Stack:** React + Vite, Tailwind, Supabase (auth + data), deployed on Vercel
- **Offer:** Legacy Essential ($997)

---

## Accounts & access
- Email + password login; new members can create an account in-app.
- Every member's deals and settings are stored in the cloud and sync across devices.
- Data is isolated per user at the database level (Row-Level Security) — a member can
  only ever see their own deals.

## Home — Command Dashboard
The landing screen is a working dashboard, not a marketing page:
- "Welcome back" header with the date and a one-click **Start a new deal**.
- **KPI strip:** saved deals, best profit, average score, buy-rated count.
- **Pipeline table:** every saved deal with ARV, projected profit, score, and verdict —
  click any row to reopen it.
- **Resume card** to jump back into your latest deal, plus a quick workflow rail.

## Profile
Opened from the profile icon (top-right). Holds:
- Account info and sign-out.
- **Investor Settings** — Cash Available, Credit Tier, and Target Wholesale Fee. Set once,
  saved to your account, and applied automatically to every deal.
- **Saved Deals** — load, delete, or export the whole pipeline to CSV.

## Rehab Estimator
- **62 line items** across interior, exterior, major systems, kitchen, and bath.
- Costs are **metro-adjusted** to the property's market (ZIP → metro lookup).
- Quick-scope presets (Cosmetic / Mid-Grade / Full Gut) and a built-in 10% contingency.
- The hold period for every downstream calculation is **auto-estimated from the rehab
  scope** (more work = longer timeline = higher carrying cost).

## Strategy — flip-first underwriting
Assumes **fix & flip** by default. With Purchase, ARV, and Rehab entered, it shows:
1. **Scenario cards** — Aggressive / Market / Conservative outcomes.
2. **Sensitivity heatmaps** — net profit across **ARV × Rehab** and **ARV × Hold time**,
   color-graded green→red, with your current deal highlighted. Shows exactly what breaks
   the deal.
3. **Monte Carlo simulation** — 8,000 runs varying ARV, rehab, and hold time with
   realistic skew (rehab and timelines lean toward overruns). Reports **chance of profit**,
   chance of hitting your target, and **P10 / P50 / P90** net profit with a distribution chart.

A toggle switches to **Rental / BRRRR** or **Wholesale**, revealing only the extra inputs
those strategies need (rent for rental; seller-finance fields for wholesale). Rental models
NOI, cap rate, DSCR, cash flow, and cash-on-cash with a DSCR refinance; wholesale models
assignment-fee scenarios.

## ZIP Market Snapshot (Zillow + Redfin)
A live market panel on the right rail, powered by a database of **26,000+ ZIP codes** of
Zillow/Redfin data. It appears once ZIP and bedrooms are entered and shows, for that ZIP:
- Typical value for the entered bedroom count — with **"Use as ARV"** one-click apply.
- Median sale price, median $/sqft, days on market, sale-to-list ratio.
- A market-heat badge (fast / balanced / slow) from months of supply.
- A live check: "your ARV is X% above/below the ZIP median $/sqft."

## Financing & Profit
Five financing stacks modeled side by side for the chosen strategy (e.g., all-cash, hard
money, HM + private money, DSCR refi, Subject-To, seller finance — availability depends on
the strategy and seller details), so the best funding path for the deal is obvious.

## Deal Score
A 20-metric scoring engine (100 points) across Financial, Market, Capital, Execution,
Strategy, and Safety — including a stress test (ARV −10%, rehab +20%, timeline slip). It
returns a letter grade and a single verdict: **BUY, WAIT, or KILL** before you sign.

---

## Data sources
- **Rehab costs:** itemized cost library, metro-adjusted.
- **Market benchmarks:** 41-metro index plus ZIP-level Zillow/Redfin export (26K+ ZIPs).
- **ZIP → metro:** live geolocation lookup.

## Related docs
- `README.md` — setup, local development, deploy.
- `docs/SUPABASE.md` — database schema, RLS, auth, and client wiring.
