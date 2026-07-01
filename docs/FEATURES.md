# EssentialOS — Feature Overview

**EssentialOS** (wordmark **"Essential Analyzer"**) is the fix-and-flip underwriting tool for
The Unshakable Investor's Legacy Essential members. It replaces the fix-and-flip
spreadsheet: enter a deal, and it estimates rehab, analyzes the economics, stress-tests
the numbers, and returns a clear **BUY / WAIT / KILL** verdict — with every deal saved to
the member's account.

- **Live app:** unshakable-essential-os.vercel.app
- **Stack:** React + Vite, Tailwind, Supabase (auth + data), jsPDF (reports), deployed on Vercel
- **Offer:** Legacy Essential ($997)
- **Tabs:** Home · Rehab · Analysis · Score (four tabs)

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
- **Resume card** to jump back into your latest deal, plus a 3-step workflow rail
  (Rehab scope → Analysis → Score).

## Profile
Opened from the profile icon (top-right). Holds:
- Account info and sign-out.
- **Investor Settings** — Cash Available, Credit Tier, and Target Wholesale Fee. Set once,
  saved to your account, and applied automatically to every deal.
- **Saved Deals** — load, delete, or export the whole pipeline to CSV.

## Saving deals
- The **Save** button (right-rail snapshot) upserts: saving a deal you loaded **updates that
  same record** instead of creating a duplicate. Brand-new deals (after "Start a new deal")
  insert a fresh record.

## Rehab Estimator
- **62 line items** across General Interior, Kitchen, Bathroom, General Exterior, and
  Major Systems & Utilities.
- Costs are **metro-adjusted** to the property's market (ZIP → metro lookup).
- Quick-scope presets (Cosmetic / Mid-Grade / Full Gut) and a built-in 10% contingency.
- A **Live Cost Meter** shows base → metro-adjusted → +10% final in real time.
- The hold period for every downstream calculation is **auto-estimated from the rehab
  scope** (more work = longer timeline = higher carrying cost).

## Analysis — flip-first underwriting
The deal's full financial workup. Assumes **fix & flip** by default, with a toggle to
**Rental / BRRRR** or **Wholesale** that reveals only the inputs those strategies need.

- **Adjust your deal** — `$`-formatted Purchase, ARV, and Rehab inputs (plus −5% / −2% /
  +2% / +5% quick nudges on ARV).
- **Result strip** — live Net Profit, BUY/WAIT/KILL verdict, and **Maximum Offer (70% rule)**
  with how far the current offer is over/under.
- **Financing & costs** — every assumption is editable in one place: LTV, interest rate,
  loan points, hold time, closing %, selling %, property tax %, and insurance + utilities.
  Edit any of them and the whole analysis updates.
- Three sub-panels:
  1. **Summary** — a "where the money goes" waterfall (ARV → purchase, rehab, financing,
     holding, closing, selling → net), the Maximum Offer breakdown, and a ratio scorecard
     (profit margin, gross spread, cost basis/ARV, ROI on cash, annualized ROI). Each ratio
     has an **"i" info circle** showing the exact formula and the numbers behind it.
  2. **Scenarios** — Aggressive / Market / Conservative outcomes.
  3. **Risk** — **sensitivity heatmaps** (net profit across ARV × Rehab and ARV × Hold time,
     color-graded green→red with your deal highlighted) and a **Monte Carlo simulation**
     (8,000 runs with realistic overrun skew → chance of profit, chance of hitting target,
     and P10 / P50 / P90 net profit).

### Rental / BRRRR view
Switching to Rental re-tools the whole Analysis view around rental returns (not flip):

- **Result strip** shows rental KPIs — **monthly cash flow**, a color-coded **DSCR** badge
  (lender minimum 1.25), and **cap rate** (with cash-on-cash).
- **Summary** shows a proper annual P&L — effective gross income (after 5% vacancy) →
  operating expenses (40%) → **NOI** → DSCR debt service → **annual cash flow** — plus a
  **BRRRR capital** block (all-in cost, 75%-ARV DSCR cash-out refi, cash left in the deal,
  cash-on-cash) and ratio chips (cap rate, DSCR, cash flow/mo, CoC) with formula popovers.
- When the refinance returns all your cash (cash left in ≤ 0), cash-on-cash reads **∞**
  ("all cash out") instead of a misleading 0%.
- Financing model: 30-yr DSCR cash-out refi at 7.25% on 75% of ARV. Scenarios (Aggressive /
  Market / Conservative) vary rent, vacancy, and expenses.

Wholesale models assignment-fee scenarios.

## Unified profit engine
Net profit, ROI, and margin are computed by a single engine, so the **Analysis tab, the
Deal Snapshot, and the Deal Score always agree** — there is no longer one number on one tab
and a different number on another.

## ZIP Market Snapshot (Zillow + Redfin)
A live market panel on the right rail, powered by a database of **26,000+ ZIP codes** of
Zillow/Redfin data. It appears once ZIP and bedrooms are entered and shows, for that ZIP:
- Typical value for the entered bedroom count — with **"Use as ARV"** one-click apply.
- **Typical rent (ZIP)** — monthly rent from Zillow's ZORI index (7,800+ ZIPs), with a
  **"Use as rent"** one-click apply that fills the rental analysis's Estimated rent field.
  ZIPs without ZORI coverage fall back to the 41-metro rent benchmark.
- Median sale price, median $/sqft, days on market, sale-to-list ratio.
- A market-heat badge (fast / balanced / slow) from months of supply.
- A live check: "your ARV is X% above/below the ZIP median $/sqft."

## Deal Score
A 20-metric scoring engine (100 points) across Financial (35), Market (15), Capital (15),
Execution (15), Strategy (15), and Safety (5) — including a stress test (ARV −10%,
rehab +20%, timeline slip). It returns a letter grade and a single verdict:
**BUY, WAIT, or KILL** before you sign, plus a focus-areas list of the weakest metrics.

## PDF report export
The **PDF** button (right-rail snapshot) generates a real, branded PDF that **downloads
directly** — no browser print dialog, no screenshot of the screen. The report is
**context-aware**, matching the tab you're on:
- **From Rehab** → property info + itemized scope of work (`…-scope.pdf`).
- **From Analysis** → the above plus the full financial analysis (`…-analysis.pdf`).
- **From Score** → all three: analysis, scope, and the 20-metric score (`…-full-report.pdf`).

Pages are paginated with "Page X of N" footers and pull live deal data — the scope of work
lists the member's actual selected line items grouped by category, with the real ZIP
market snapshot.

---

## Data sources
- **Rehab costs:** itemized cost library, metro-adjusted.
- **Market benchmarks:** 41-metro index plus ZIP-level Zillow/Redfin export (26K+ ZIPs).
- **ZIP rent:** Zillow ZORI monthly rent index, 7,800+ ZIPs (as of 2026-05).
- **ZIP → metro:** live geolocation lookup.

## Related docs
- `README.md` — setup, local development, deploy.
- `docs/SUPABASE.md` — database schema, RLS, auth, and client wiring.
