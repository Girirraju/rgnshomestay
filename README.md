# 🏡 RGN's Homestay Homestyle Living — Karur

A full-stack, commercial-ready booking website for **RGN's Homestay Homestyle Living (Karur)** — direct guest reservations, a Gemini-powered chat concierge, and Google Calendar/Sheets/Gmail integration, with no platform commission and no middleman.

- **Backend**: Node.js + Express (`backend/`)
- **Frontend**: React 19 + TanStack Start/Router + Tailwind CSS v4 (`rgn-homestyle-retreat-main/`)
- **Integrations**: Google Calendar API, Google Sheets API, Gmail API, Gemini API

---

## 🌟 Key Features

- **Heritage Warm Minimal design** — terracotta/brass palette, Playfair Display + Plus Jakarta Sans, Pinterest-style masonry gallery. See [DESIGN.md](DESIGN.md).
- **Direct booking, zero commission** — guests reserve straight from Mrs S Gowri; live availability is checked against Google Calendar before a booking is accepted.
- **AI chat concierge** — a Gemini-powered assistant (bottom-right widget) answers questions about rooms, rates, amenities, booking, and Karur/Tamil Nadu travel, with FAQ suggestions surfaced up front. See [Chat assistant & data privacy](#-chat-assistant--data-privacy) below.
- **Legal pages** — dedicated [Terms & Conditions](rgn-homestyle-retreat-main/src/routes/terms.tsx), [Privacy Policy](rgn-homestyle-retreat-main/src/routes/privacy.tsx), and [Cancellation Policy](rgn-homestyle-retreat-main/src/routes/cancellation-policy.tsx) pages, linked from the footer and required (checkbox) before a booking is submitted.
- **Accommodations & inclusions**:
  - **2BHK Full Home**: ₹8,000/night + ₹500 one-time cleaning charge.
  - **1BHK Suite**: ₹6,000/night + ₹500 one-time cleaning charge.
  - Inclusions: free covered reserved parking, welcome drink, AC rooms, purified RO water, safety lockers, free board games.
  - Guest count: 1 to 15+ per booking.
- **Host & location**:
  - Host Manager: Mrs S Gowri — +91 70107 75902 · `rgnshomestay@gmail.com`
  - 25/4 Kamaraj Nagar, Sungagate, Near Sungagate Bus stop, Thanthonimalai Post, Karur-639004
  - ~5–10 minutes' walk from Sri Thanthonimalai Perumal Temple & Thirumurugan Mahal
  - Check-in 2:00 PM · Check-out 2:00 PM
- **Development mock mode** — if Google credentials aren't set, the backend transparently mocks Calendar/Sheets/Gmail so the app is fully testable without live API keys.

---

## 🔒 Security

This is a small commercial site handling real guest PII (name, phone, email) and payment-adjacent booking data, so the backend applies defense-in-depth appropriate to that:

- **Helmet** security headers on every response (CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, no `X-Powered-By`, cross-origin resource policy tuned for the API's cross-origin frontend).
- **CORS allowlist** via `CORS_ORIGINS` — only listed origins may call the API. In production (`NODE_ENV=production`), an unset `CORS_ORIGINS` blocks all cross-origin requests by default (fails closed); non-production defaults to allow-all for local dev convenience.
- **Rate limiting** at three layers: a global limiter across all `/api` routes, a stricter limiter on `/api/book`, and one on `/api/chat` (protects the Gemini quota).
- **Request size caps** — JSON bodies are capped at 15kb; oversized requests get a clean `413`, not a crash.
- **Strict input validation** on every field of `POST /api/book` (name/phone/email/date/guest-count patterns, control-character rejection to block header/formula injection, room-type and date-range sanity checks) before anything touches Google APIs.
- **Google Sheets formula-injection protection** — booking rows are written with `valueInputOption: RAW`, so a guest name like `=IMPORTXML(...)` is stored as literal text, never evaluated as a formula.
- **Duplicate-booking protection** — a guest (matched by normalized email *or* phone) cannot submit a second booking whose dates overlap one they already hold; the check reads live (uncached) sheet data at submission time to minimize race conditions.
- **Honeypot anti-bot field** on the reservation form — invisible to real guests (`aria-hidden`, `tabIndex={-1}`, visually hidden), rejected server-side if filled.
- **JSON-only error handling** — a centralized error handler and a JSON 404 for unmatched `/api/*` routes mean the API never leaks a stack trace or Express's default HTML error page.
- **Secrets hygiene** — all credentials (Google service account key, OAuth secrets, Gemini API key) live only in `backend/.env`, which is git-ignored (see `.gitignore`); `backend/.env.example` ships placeholders only. No secret is hardcoded in source. The repository's git history was audited and contains no committed credentials.
- **Dependencies** — `npm audit` is clean (0 known vulnerabilities) on both `backend/` and `rgn-homestyle-retreat-main/` as of the last update to this file.

**Deploying to production?**
1. Set `NODE_ENV=production`.
2. Set `CORS_ORIGINS` to your exact deployed frontend URL(s) — do not leave it unset.
3. Set `PORT` as required by your host.
4. If you run behind a reverse proxy/load balancer, configure Express's `trust proxy` setting appropriately so rate limiting sees real client IPs (not enabled by default, since enabling it without an actual proxy in front would let clients spoof `X-Forwarded-For` to bypass rate limits).

---

## 🤖 Chat assistant & data privacy

The chat widget (`rgn-homestyle-retreat-main/src/components/ChatBot.tsx`) talks to `POST /api/chat` (`backend/src/routes/chat.js`), which calls the Gemini API (`backend/src/services/geminiService.js`) with a system prompt built from the site's real room/rate/policy content — so it doesn't invent prices or amenities.

For availability questions, the assistant is given a **privacy-filtered** view of the booking sheet: **guest name, room type, and stay dates only.** Phone numbers, email addresses, guest counts, and Booking IDs are stripped out server-side (`sheetsService.getPublicBookingSummaries`) *before* the data is ever sent to Gemini — so the model cannot leak that information no matter how it's prompted, because it was never given it. The system prompt additionally instructs the assistant to refuse such requests explicitly. This is documented for guests in the [Privacy Policy](rgn-homestyle-retreat-main/src/routes/privacy.tsx).

---

## 📐 Architecture Overview

```mermaid
flowchart TD
    A[Guest visits website] --> B[Frontend: TanStack Start / React]
    B -->|GET /api/booked-dates?roomType=2bhk| C[Backend API - Express on Port 5000]
    C -->|Read Calendar Events| D[Google Calendar API]
    B -->|Submit Booking Form| C
    C -->|Duplicate-contact check| E[Google Sheets API]
    C -->|Re-validate dates| D
    C -->|Append booking row| E
    C -->|Create blocked event| D
    C -->|Send owner email| F[Gmail API]
    F --> G[Host Email Inbox]
    C -->|Return Booking ID + owner contact| B
    B --> H[Confirmation Screen]

    B -->|POST /api/chat| C
    C -->|Read privacy-filtered bookings| E
    C -->|Prompt + filtered context| I[Gemini API]
    I -->|Reply| C --> B
```

---

## 📂 Repository Structure

```
stitch_rgn_homestay_booking_portal/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── availability.js    # GET /api/booked-dates
│   │   │   ├── booking.js         # POST /api/book
│   │   │   └── chat.js            # POST /api/chat
│   │   ├── services/
│   │   │   ├── googleAuth.js      # OAuth2 client + service-account JWT
│   │   │   ├── calendarService.js # Google Calendar read/write
│   │   │   ├── sheetsService.js   # Sheets read/append + privacy filtering + dup-check
│   │   │   ├── gmailService.js    # Gmail notification dispatch
│   │   │   └── geminiService.js   # Gemini chat completion + system prompt
│   │   └── index.js               # Express app: security middleware, routes, error handling
│   ├── .env.example
│   └── package.json
├── rgn-homestyle-retreat-main/     # Frontend (TanStack Start)
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomestayPage.tsx   # Main site: hero, rooms, amenities, gallery, booking form
│   │   │   ├── ChatBot.tsx        # Floating chat assistant widget
│   │   │   ├── LegalPage.tsx      # Shared layout for legal pages
│   │   │   └── ui/                # shadcn/ui primitives
│   │   ├── routes/
│   │   │   ├── index.tsx          # /
│   │   │   ├── terms.tsx          # /terms
│   │   │   ├── privacy.tsx        # /privacy
│   │   │   └── cancellation-policy.tsx  # /cancellation-policy
│   │   └── assets/                # Photos (hero, rooms, gallery)
│   └── package.json
├── DESIGN.md                       # Design system tokens
├── SITE_CONTENT.md                 # Content inventory / source of truth for copy
└── README.md
```

---

## ⚡ Quickstart & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/girirraju/rgnshomestay.git
cd stitch_rgn_homestay_booking_portal
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in real values, see below
npm run dev             # http://localhost:5000
```

### 3. Frontend
```bash
cd rgn-homestyle-retreat-main
npm install
npm run dev              # http://localhost:5173 (or next free port)
```

### 4. Environment variables (`backend/.env`)
```env
# Google OAuth2 (Calendar & Gmail) — or use a service account instead (see below)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/oauth2callback
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Google service account (Sheets + Calendar) — share the calendar/sheet with this email
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

OWNER_EMAIL=rgnshomestay@gmail.com
OWNER_PHONE=+917010775902
OWNER_CALENDAR_ID=primary

SHEET_ID=your-google-sheet-id

# Chat assistant
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash

PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:8080,http://localhost:5173,http://localhost:5174
```

Never commit `.env` — it's git-ignored. `.env.example` (placeholders only) is the tracked reference.

---

## 📄 Policies

Full policies live on their own pages, linked from the site footer and required (via checkbox) at booking time:

- [Terms & Conditions](rgn-homestyle-retreat-main/src/routes/terms.tsx) — `/terms`
- [Privacy Policy](rgn-homestyle-retreat-main/src/routes/privacy.tsx) — `/privacy`
- [Cancellation Policy](rgn-homestyle-retreat-main/src/routes/cancellation-policy.tsx) — `/cancellation-policy`

---

## 📜 License

MIT License © 2026 RGN's Homestay Homestyle Living. Managed by Mrs S Gowri.
