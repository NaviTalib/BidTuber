# BidTuber

A paid-placement leaderboard for YouTube channels — creators bid to claim a
rank, outbidding whoever currently holds it. Built with React + Tailwind on
the frontend and Node/Express + MongoDB + Razorpay on the backend.

## How the mechanic works

- Each rank on the board has a current price.
- To claim a rank that's already taken, you pay ₹1 more than its current
  price. The channel you outbid gets pushed down one spot (and so on down
  the board).
- To claim a brand-new rank at the bottom of the board, you pay the floor
  price (₹5 by default, configurable via `MIN_CLAIM_PAISE`).
- A channel only goes live on the board after Razorpay confirms the payment
  (server-side signature verification) — nothing is published on a client-side
  "success" callback alone.

## Project structure

```
bidtuber/
  backend/    Express API + MongoDB (Mongoose) + Razorpay integration
  frontend/   React + Tailwind UI, Razorpay Checkout.js
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

By default the API connects to a local MongoDB at
`mongodb://127.0.0.1:27017/bidtuber` — make sure `mongod` is running
(`mongod --version` to check it's installed, then just run `mongod` in a
terminal, or start it as a service). If you're using MongoDB Atlas instead,
paste your connection string into `MONGODB_URI` in `.env`.

Local MongoDB (default if you're running `mongod` locally):
```
MONGODB_URI=mongodb://127.0.0.1:27017/bidtuber
```
Edit `.env` and add your real Razorpay keys from
https://dashboard.razorpay.com/app/keys:

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx   # use rzp_live_... in production
RAZORPAY_KEY_SECRET=your_secret_here
CLIENT_ORIGIN=http://localhost:5173  # your deployed frontend URL in production
```

Run it:

```bash
npm run dev
# BidTuber API listening on http://localhost:4000
```

Make sure MongoDB is running before this step — either a local `mongod`, or an Atlas cluster referenced by `MONGODB_URI`.

## 2. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env` if your API isn't on `http://localhost:4000/api`:

```
VITE_API_URL=https://your-api-domain.com/api
```

Run it:

```bash
npm run dev
# open http://localhost:5173
```

## 3. Going to production

- **Backend**: deploy to any Node host (Render, Railway, Fly.io, a VPS,
  etc.) and point `MONGODB_URI` at a MongoDB Atlas cluster or your own
  managed MongoDB instance instead of a local `mongod`.
- **Frontend**: `npm run build` in `frontend/`, then deploy the `dist/`
  folder to Vercel, Netlify, Cloudflare Pages, etc.
- **Razorpay**: switch `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` to your
  live keys once your Razorpay account is activated for live payments, and
  point `CLIENT_ORIGIN` at your real frontend domain.
- I can't host this live or hold your Razorpay keys myself from this chat —
  everything above needs to run on infrastructure you control.

## A note on MongoDB and concurrency

Rank-shifting on a successful payment (`backend/src/routes/payment.js`) runs
as two sequential MongoDB operations rather than a single atomic
transaction, since MongoDB transactions require a replica set (a plain
standalone `mongod` doesn't support them). For a small project this is fine
— but if you expect many people claiming ranks at the exact same moment,
consider running MongoDB as a single-node replica set and wrapping that
logic in a session transaction.

## What's deliberately left out (add if you need them)

- Admin dashboard for moderating/removing listings
- Email receipts on successful placement
- Razorpay webhook endpoint as a backup to the client-side verify call (recommended for production so a payment is still recorded even if the browser tab closes before `verify` fires)
- Rate limiting / spam protection on the claim endpoint
