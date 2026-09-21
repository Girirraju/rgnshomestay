# RGN's Homestay — Current Site Content Inventory

Extracted from [index.html](index.html) / [code.html](code.html) (identical files — the current static Airbnb/Pinterest-style frontend) and [README.md](README.md). Use this as the single source of truth for **content** (text, prices, images, copy) when rebuilding the frontend in React. It intentionally excludes styling — see [DESIGN.md](DESIGN.md) for the new theme system.

---

## 1. Brand & Meta

- **Site title**: RGN's Homestay Homestyle Living — Karur
- **Tagline**: "Your Comfort, *Our Tradition.*"
- **Category badge**: "Karur • Homestyle Retreat"
- **Rating badge**: ⭐ 4.98 — "Homestay Verified • Mrs S Gowri Host"
- **Logo**: circular "RGN" monogram badge

## 2. Navigation

| Label | Anchor |
|---|---|
| Overview | `#home` |
| Rooms & Rates | `#rooms` |
| Amenities | `#amenities` |
| Gallery | `#gallery` |
| Contact & Book | `#booking` |

CTA button (header, always visible): **"Reserve Stay"** → `#booking`

## 3. Hero Section

**Headline**: "Your Comfort, Our Tradition."

**Body copy**:
> Stay in the heart of Karur, moments from the sacred hills of South-Based Tirupati — the revered Arulmigu Kalyana Venkataramana Swamy Temple. A home-style homestay built for family, weddings, and pilgrims alike, offering warm hospitality just steps from the marriage mahal and centuries of tradition.

**Feature pills** (under hero copy):
- 🍹 Welcome Drink Included
- 🚗 Covered Reserved Parking - Free
- 🕑 Check-in 2:00 PM • Check-out 2:00 PM

**Quick-search widget** (embedded in hero, syncs to main booking form):
- Accommodation select: `2BHK Full Home (₹8,000/nt)` / `1BHK Suite (₹6,000/nt)`
- Check-in date picker (label: "Check-in (2:00 PM)")
- Check-out date picker (label: "Check-out (2:00 PM)")
- CTA: **"Check Availability"** → scrolls to booking form, copies dates across

## 4. Rooms & Rates (`#rooms`)

Section eyebrow: "Living Spaces" · Heading: "Homestyle Accommodations"
Subtext: "Equipped with AC rooms, purified RO water, safety lockers, and free covered parking."

### 4a. 2BHK Full Home
- **Badge**: "Family & Wedding Stay"
- **Price**: ₹8,000 / night
- **Description**: "Full spacious residence featuring AC bedrooms, attached modern bathrooms, RO water filter, safety lockers, and free board games."
- **Inclusions**:
  - Cleaning charge: ₹500 (one-time)
  - Covered Reserved Parking: Free
  - Welcome Drink Included
- **Image**: `https://lh3.googleusercontent.com/aida-public/AB6AXuC1s3Az21zxPZpMIpXGOOYvq_6bhpvsNIcqy3_jqGbzrgp5QMTBTqhpHYkR05unF-Axo9wN_f8NKjS8dlxn_h-gVuooyFawMPdnwMpr-qM0bWslNPzKDHcK48Ff4tuamE_XMm69Igf9NvAlpt3pzCNDCrBWHyzdm1ki0lYwM1CGciGzoHpMqZ7IWzY1jH_ne3gvGh9k5hfBRCHMYIocW3ATEBgg54ne90ai-hMeLtlbXkAi6faHwil9wQ` *(placeholder — replace with real photo)*
- **CTA**: "Select 2BHK Full Home (₹8,000/nt)" → jumps to booking form, pre-selects room

### 4b. 1BHK Suite
- **Badge**: "Pilgrim & Couple Suite"
- **Price**: ₹6,000 / night
- **Description**: "Private serene suite featuring AC bedroom, living hall, purified RO drinking water, safety lockers, and quiet ambience."
- **Inclusions**: same three as above (₹500 cleaning, free parking, welcome drink)
- **Image**: `https://lh3.googleusercontent.com/aida-public/AB6AXuDB78oN9qyqj-nXEU6gG1I4AvmOIUBTBG4SKgl7648bYvyxZpBTgCXaQ_9uTUECDV7wbi5oXZ22skWwNRfa4A5E71r6utZC2MxSyUrh4qRfbmzliFyxeGE5Dakeb5VcGZgO2mgvmELDpjkvUcG5BdE2aK2aW8-m8saCsH255e4ZQhnLZkSTrpdUMP1EbnJIoCpK8Q3xzFjJDeYiTNLhxdudFUbkQM2gisLyjT9KYyP1g1xgOTEd8tGfYg` *(placeholder)*
- **CTA**: "Select 1BHK Suite (₹6,000/nt)"

## 5. Amenities (`#amenities`)

Eyebrow: "Homestay Comforts" · Heading: "Homestay Facilities"

| Icon | Title | Description |
|---|---|---|
| ❄️ | AC Rooms | Fully air-conditioned bedrooms for complete relaxation. |
| 💧 | Purified RO Water | Continuous multi-stage RO drinking water for health & safety. |
| 🔒 | Safety Lockers | In-room safety lockers for guests' valuables. |
| 🧩 | Free Board Games | Complimentary indoor games for quality family time. |
| 🚗 | Covered Reserved Parking | Gated covered parking provided on-site completely free. |
| 🍹 | Welcome Drink | Complimentary refreshing welcome beverage served on arrival. |
| 🛕 | Temple & Heritage Vicinity | Situated just 5 minutes walk from Sri Thanthonimalai Perumal Temple and Thirumurugan Mahal, surrounded by historic sabhas and Carnatic culture. |
| 🛏️ | Authentic Decor | Clean, traditional homestyle aesthetic built for weddings and pilgrims. |

## 6. Gallery (`#gallery`, Pinterest masonry)

Eyebrow: "Visual Archive" · Heading: "Homestay Gallery"

| Caption | Subcaption | Image |
|---|---|---|
| Traditional Living Area | Serene courtyard space | (same as 2BHK image above) |
| Air-Conditioned Master Bedroom | Loomed linens & garden view | (same as 1BHK image above) |
| Shaded Sit-Out Corridor | Relaxed homestyle thinnai | `https://lh3.googleusercontent.com/aida-public/AB6AXuAugIRwR-uIzdmYD2ytBlNGuqVyxsBULxxBOzkljGSNs09E-GzUmgWoWiSYd2vvUnqImHVaeMEx386ptZLCUNQz5u_Lt84M3cZ5U4JGpkanPo80Aabe5RJwJENY4OjxOx5SrbxyjdhQLvatdGaXAoxlFBMHOCKuRJIZWAd3omn2xmrDfyigzjGgyEDBEsuJWnZbjkyMfAWvnq7ENgsMGB0z6Kf3mb6EbfCSJQLS8m4GWc9of9RUwJCd-g` |

*(Only 3 images currently — real photography should replace all placeholder URLs.)*

## 7. Booking & Host Section (`#booking`)

### 7a. Host bio card
- **Host Manager**: Mrs S Gowri — "Direct Resident Host"
- **Address**: 25/4 Kamaraj Nagar, Sungagate, Near Sungagate Bus stop, Thanthonimalai Post, Karur-639004
- **Phone**: +91 70107 75902 (tel link)
- **Email**: rgnshomestay@gmail.com (mailto link)
- **Hours**: Check-in 2:00 PM • Check-out 2:00 PM
- **WhatsApp CTA**: "Direct WhatsApp (+91 70107 75902)" → `https://api.whatsapp.com/send/?phone=%2B917010775902&text&type=phone_number&app_absent=0&wame_ctl=1`

### 7b. Location highlight card
- Eyebrow: "Location Highlight"
- Heading: "10 Mins Walk to Sri Thanthonimalai Perumal Temple"
- Body: "Situated just 5 minutes walk from Sri Thanthonimalai Perumal Temple and Thirumurugan Mahal."

### 7c. Guest Reservation Form
- Heading: "Guest Reservation Form"
- Subtext: "Managed directly by Mrs S Gowri with zero platform commissions."
- **Fields**:
  - Full Name * (text)
  - Phone Number * (tel, placeholder `7010775902`)
  - Email Address * (email, placeholder `guest@example.com`)
  - Preferred Accommodation * — radio cards: 2BHK Full Home (₹8,000/night + ₹500 cleaning) / 1BHK Suite (₹6,000/night + ₹500 cleaning)
  - Check-in (2:00 PM) * (date)
  - Check-out (2:00 PM) * (date)
  - Guests * (select: 1 / 2 (default) / 3 / 4 / 5 / 6+)
- **Submit CTA**: "Confirm Booking Request"

### 7d. Confirmation state (shown after successful submit)
- Eyebrow: "Namaskaram" · Heading: "Booking Confirmed! 🙏"
- Body: "Thank you for choosing RGN's Homestay. Your room request has been sent to Mrs S Gowri and recorded."
- **Summary card**: Booking ID, Reserved Space, Stay Dates, Guest Name
- **Host contact block**: Mrs S Gowri, phone + email, "Call Host" / "WhatsApp" buttons
- Link back: "← Make Another Reservation"

## 8. Footer

- Brand blurb: "Stay in the heart of Karur, moments from the sacred hills of Arulmigu Kalyana Venkataramana Swamy Temple. Built for family, weddings, and pilgrims."
- Host Manager: Mrs S Gowri
- Reach Us: full address, phone, email, check-in/out hours (repeated from host card)
- **Homestay Policies** (open modal):
  - Privacy Policy
  - Guest Guidelines
  - Cancellation Policy
- Copyright: "© 2026 RGN's Homestay Homestyle Living. Designed with Airbnb & Pinterest minimalist aesthetic." *(update wording once rebranded)*

## 9. Policy Modal Copy

| Policy | Text |
|---|---|
| Privacy Policy | All personal details given will be considered as booking individual details and collected exclusively for homestay use. |
| Guest Guidelines | Follow all rules mentioned by the homestay manager. |
| Cancellation Policy | Cancellation non-refundable. |

## 10. Booking Flow / API Contract (already implemented in `backend/`)

- `GET /api/booked-dates?roomType=2bhk|1bhk` → `{ bookedRanges: [{ start, end }, ...] }` (reads Google Calendar; disables booked dates)
- `POST /api/book` — payload:
  ```json
  {
    "name": "string",
    "phone": "string",
    "email": "string",
    "roomType": "2bhk | 1bhk",
    "checkIn": "YYYY-MM-DD",
    "checkOut": "YYYY-MM-DD",
    "guests": "number"
  }
  ```
  response: `{ success: true, bookingId: "bk_xxxx", owner: { phone, email } }` or `{ success: false, message }` on date conflict.
- On success, backend also: appends a row to Google Sheets, creates a blocking Calendar event, and emails the owner via Gmail API.
- **Mock mode**: if Google credentials are unset, backend fakes all of the above so the UI is fully testable without real API keys.
- Default date prefill on load: check-in = today+3, check-out = today+6.

## 11. Current (old) visual theme — for reference only

Airbnb/Pinterest minimalist white theme — **being replaced**, see below:
- Accent: Airbnb Coral Red `#FF385C` (hover `#E00B41`, active `#B80935`)
- Surfaces: white `#FFFFFF` cards on `#F7F7F7` background, `#EBEBEB` hairline borders
- Text: `#222222` primary, `#717171` secondary
- Fonts: Plus Jakarta Sans (body), Playfair Display (accents), Material Symbols Outlined (icons)
- Background texture: moss/brick photo (`bg-moss.jpg`) behind translucent white overlay
- Shapes: full-pill buttons/nav, `rounded-2xl`/`rounded-3xl` cards, Pinterest CSS-columns masonry gallery

---

## Current build status (as of this writing)

- `backend/` — Express API, fully wired to Calendar/Sheets/Gmail services with mock-mode fallback. **Reusable as-is.**
- `frontend/` — Vite + React + Tailwind scaffold already started, mixing two themes:
  - `App.jsx` still hardcodes the **old** Airbnb colors inline and only renders the hero + booking form (no Rooms, Amenities, Gallery, Host card, Footer, or Policy modals yet).
  - `BookingForm.jsx`, `Calendar.jsx`, `ConfirmationScreen.jsx`, and `tailwind.config.js` already use the **new** "Heritage Warm Minimal" design tokens from [DESIGN.md](DESIGN.md) (terracotta `#801323` primary, brass `#C89D56` secondary, Playfair Display + Plus Jakarta Sans).
- Nothing in `frontend/` yet covers sections 3–9 above in the new theme.
