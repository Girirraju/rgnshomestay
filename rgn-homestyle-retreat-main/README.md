# RGN Homestyle Retreat

RGN's Homestay Website Rebuild

Project Brief
Build a modern, responsive homestay booking website for RGN's Homestay Homestyle Living in Karur, Tamil Nadu. This is a React + Tailwind site (Vite). The visual language should blend two references:

Airbnb's product feel — soft rounded pill buttons and nav, generous white space, clean card grids, coral-adjacent warm accent color, friendly sans-serif type, subtle shadows.
The attached real-estate template screenshot — a full-bleed dark-overlay hero image with a bold two-line headline, a floating pill-shaped search/availability bar that sits on top of the hero image, a dark rounded "primary action" button in the top nav, and a clean 3-up card grid below the hero with rounded property photos, small spec icons, and a price-per-period line.
Combine these: dark-overlay hero with a floating pill search widget (from the template) + warm homestay color palette + soft rounded Airbnb-style cards and buttons throughout the rest of the page.

Brand
Name: RGN's Homestay Homestyle Living — Karur
Tagline: "Your Comfort, Our Tradition."
Logo: simple circular monogram badge with "RGN"
Rating badge: ⭐ 4.98 — "Homestay Verified • Mrs S Gowri Host"
Category badge: "Karur • Homestyle Retreat"
Design System — South Indian Temple Palette
Move away from Airbnb coral and generic terracotta toward a palette drawn from South Indian temple architecture and ritual color: gopuram maroon, temple gold/brass, kumkum vermilion, turmeric/saffron, and sandalwood neutrals. The overall feel should read as warm, ornate, and rooted — not corporate.

Primary accent — Gopuram Maroon #6B0F1A: deep temple-red, close to the color of temple towers and kumkum. Use on primary CTAs, active nav states, price highlights, section eyebrows.
Secondary accent — Temple Gold #B8860B (deeper, more metallic than brass) and Vermilion #C1440E as a warm secondary highlight: gold for borders, dividers, icon circles, hover states; vermilion for small badges, tags, and accent details (used sparingly, like a kumkum dot — not as a dominant color)
Tertiary accent — Turmeric/Saffron #E9A227: sparingly, for small highlight chips (e.g. the rating badge, feature pills) — evokes saffron cloth and temple flags
Neutrals: warm ivory #FBF6EC page background (like sandalwood/temple whitewash, not stark white), pure white #FFFFFF for cards so they lift off the ivory background, #2A1B14 primary text (dark sandalwood-brown, not pure black), #6E5A4D secondary text, #E8D9C3 hairline borders
Ornamental touches: thin gold-toned kolam/rangoli-inspired border patterns or a subtle repeating temple-motif line (lotus, kolam dots, or a simple geometric border) used as section dividers or a header/footer trim — kept thin and understated, not busy
Fonts: Playfair Display or a similar high-contrast serif for headings (gives an inscriptional, carved-stone feel appropriate to a temple town); Plus Jakarta Sans for body/UI text for readability
Shape language: fully-rounded pill buttons and nav pills (Airbnb-style ease of use), rounded-2xl/rounded-3xl on cards and images, soft layered shadows tinted warm-maroon rather than pure black
Icons: simple line icons (Material Symbols Outlined or Lucide), housed in gold-ringed or maroon-filled circles for the amenities grid to echo temple medallion styling
Motion: gentle fade/slide-in on scroll for cards, smooth hover-lift (translateY -4px + shadow increase) on all cards and buttons, smooth anchor scrolling for nav links
Global Layout
Header / Navigation
Sticky, transparent-over-hero → solid white on scroll
Left: circular "RGN" monogram + wordmark "RGN's Homestay"
Center/right nav links (pill-hover style like Airbnb's underline-free tab hover): Overview (#home), Rooms & Rates (#rooms), Amenities (#amenities), Gallery (#gallery), Contact & Book (#booking)
Right-most: solid terracotta pill button "Reserve Stay" → scrolls to #booking (styled like the dark pill "Try Now" button in the reference screenshot, but in terracotta)
Hero Section (mirrors the reference screenshot's structure)
Full-width, ~85vh, high-quality homestay/courtyard photo as background with a dark gradient overlay (bottom-heavy, so the floating search bar and text stay legible)
Large two-line serif headline, left-aligned on desktop, centered on mobile: "Your Comfort, Our Tradition."
Supporting paragraph below headline (max-width ~560px):
Stay in the heart of Karur, moments from the sacred hills of South-Based Tirupati — the revered Arulmigu Kalyana Venkataramana Swamy Temple. A home-style homestay built for family, weddings, and pilgrims alike, offering warm hospitality just steps from the marriage mahal and centuries of tradition.

Three feature pills under the copy (rounded, translucent-white/blur background, small icon + label):
🍹 Welcome Drink Included
🚗 Covered Reserved Parking – Free
🕑 Check-in 2:00 PM • Check-out 2:00 PM
Floating quick-search widget anchored near the bottom of the hero, overlapping into the section below (exactly like the pill search bar in the reference image — white rounded-full/rounded-3xl bar with internal dividers):
Accommodation dropdown: 2BHK Full Home (₹8,000/nt) / 1BHK Suite (₹6,000/nt)
Check-in date picker — label "Check-in (2:00 PM)"
Check-out date picker — label "Check-out (2:00 PM)"
Terracotta pill CTA: "Check Availability" → smooth-scrolls to the booking form and pre-fills the dates/room selected
Rooms & Rates (#rooms)
Eyebrow text: "Living Spaces" · Heading: "Homestyle Accommodations"
Subtext: "Equipped with AC rooms, purified RO water, safety lockers, and free covered parking."
2-column card grid (Airbnb listing-card style: rounded image on top, content below, hover-lift):
2BHK Full Home — badge "Family & Wedding Stay", ₹8,000/night. "Full spacious residence featuring AC bedrooms, attached modern bathrooms, RO water filter, safety lockers, and free board games." Inclusions list: Cleaning charge ₹500 (one-time), Covered Reserved Parking – Free, Welcome Drink Included. CTA: "Select 2BHK Full Home (₹8,000/nt)" → jumps to booking form with this room pre-selected.
1BHK Suite — badge "Pilgrim & Couple Suite", ₹6,000/night. "Private serene suite featuring AC bedroom, living hall, purified RO drinking water, safety lockers, and quiet ambience." Same three inclusions. CTA: "Select 1BHK Suite (₹6,000/nt)".
Use placeholder <img> src attributes for now (real photos to be swapped in later) — do not hardcode the old Google-hosted placeholder URLs from the previous build.
Amenities (#amenities)
Eyebrow: "Homestay Comforts" · Heading: "Homestay Facilities"
4-column responsive icon-grid (2-col on tablet, 1-col on mobile), each item = icon in a soft brass-tinted circle + title + one-line description:
❄️ AC Rooms — Fully air-conditioned bedrooms for complete relaxation.
💧 Purified RO Water — Continuous multi-stage RO drinking water for health & safety.
🔒 Safety Lockers — In-room safety lockers for guests' valuables.
🧩 Free Board Games — Complimentary indoor games for quality family time.
🚗 Covered Reserved Parking — Gated covered parking provided on-site completely free.
🍹 Welcome Drink — Complimentary refreshing welcome beverage served on arrival.
🛕 Temple & Heritage Vicinity — Situated just 5 minutes' walk from Sri Thanthonimalai Perumal Temple and Thirumurugan Mahal, surrounded by historic sabhas and Carnatic culture.
🛏️ Authentic Decor — Clean, traditional homestyle aesthetic built for weddings and pilgrims.
Gallery (#gallery)
Eyebrow: "Visual Archive" · Heading: "Homestay Gallery"
Pinterest-style CSS-columns masonry layout, rounded-2xl images, hover zoom + caption overlay on hover:
"Traditional Living Area" — Serene courtyard space
"Air-Conditioned Master Bedroom" — Loomed linens & garden view
"Shaded Sit-Out Corridor" — Relaxed homestyle thinnai
Use placeholder images; layout should gracefully support more images being added later.
Booking & Host Section (#booking)
Two-column layout on desktop (host/location info left, form right), stacking on mobile.

Left column:

Host bio card: "Mrs S Gowri — Direct Resident Host"; address "25/4 Kamaraj Nagar, Sungagate, Near Sungagate Bus stop, Thanthonimalai Post, Karur-639004"; phone +91 70107 75902 (tel: link); email rgnshomestay@gmail.com (mailto: link); hours "Check-in 2:00 PM • Check-out 2:00 PM"; WhatsApp CTA button "Direct WhatsApp (+91 70107 75902)" linking to https://api.whatsapp.com/send/?phone=%2B917010775902&text&type=phone_number&app_absent=0&wame_ctl=1
Location highlight card: eyebrow "Location Highlight", heading "10 Mins Walk to Sri Thanthonimalai Perumal Temple", body "Situated just 5 minutes walk from Sri Thanthonimalai Perumal Temple and Thirumurugan Mahal."
Right column — Guest Reservation Form:

Heading: "Guest Reservation Form"
Subtext: "Managed directly by Mrs S Gowri with zero platform commissions."
Fields: Full Name* (text), Phone Number* (tel, placeholder 7010775902), Email Address* (email, placeholder guest@example.com), Preferred Accommodation* (radio cards — 2BHK Full Home ₹8,000/night + ₹500 cleaning / 1BHK Suite ₹6,000/night + ₹500 cleaning), Check-in* (date), Check-out* (date), Guests* (select: 1 / 2 default / 3 / 4 / 5 / 6+)
Submit CTA: "Confirm Booking Request" (terracotta pill button, full-width on mobile)
Disable already-booked dates by calling GET /api/booked-dates?roomType=2bhk|1bhk → { bookedRanges: [{ start, end }, ...] }
On submit, POST /api/book with { name, phone, email, roomType, checkIn, checkOut, guests } → success returns { success: true, bookingId, owner: { phone, email } }; failure returns { success: false, message } (e.g. date conflict) and should show an inline error, not a toast that hides form state
Default date prefill on page load: check-in = today + 3 days, check-out = today + 6 days
Confirmation state (replaces the form after a successful submit):

Eyebrow "Namaskaram" · Heading "Booking Confirmed! 🙏"
Body: "Thank you for choosing RGN's Homestay. Your room request has been sent to Mrs S Gowri and recorded."
Summary card: Booking ID, Reserved Space, Stay Dates, Guest Name
Host contact block with "Call Host" and "WhatsApp" buttons
Link back: "← Make Another Reservation" (resets form)
Footer
Brand blurb: "Stay in the heart of Karur, moments from the sacred hills of Arulmigu Kalyana Venkataramana Swamy Temple. Built for family, weddings, and pilgrims."
Host Manager: Mrs S Gowri
"Reach Us" block: repeat full address, phone, email, check-in/out hours
"Homestay Policies" links that open modals:
Privacy Policy: "All personal details given will be considered as booking individual details and collected exclusively for homestay use."
Guest Guidelines: "Follow all rules mentioned by the homestay manager."
Cancellation Policy: "Cancellation non-refundable."
Copyright line: "© 2026 RGN's Homestay Homestyle Living."
Technical Notes
Stack: Vite + React + Tailwind CSS
Keep the existing Express backend API contract exactly as described above (/api/booked-dates, /api/book) — this is a frontend rebuild only, do not change the API shape
Support a mock-mode fallback gracefully if the API is unreachable, so the UI stays testable
Fully responsive: mobile-first, with the hero search widget collapsing to a stacked full-width card on small screens
Accessible: proper label/input association on the form, sufficient contrast for text over the hero overlay, keyboard-navigable nav and modals
No lorem ipsum — use the exact copy provided above throughout
## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
