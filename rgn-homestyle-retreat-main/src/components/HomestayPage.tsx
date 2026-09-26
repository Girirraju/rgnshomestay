import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  CircleCheck,
  Droplets,
  ExternalLink,
  Gamepad2,
  GlassWater,
  HeartHandshake,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { z } from "zod";

import heroImage from "@/assets/bg-moss.jpg";
import logoMark from "@/assets/logo-mark.jpg";
import homeImage from "@/assets/rgn-2bhk.jpg";
import suiteImage from "@/assets/rgn-1bhk.jpg";
import galleryEntranceImage from "@/assets/gallery-entrance.jpg";
import galleryHallImage from "@/assets/gallery-hall.jpg";
import galleryLivingImage from "@/assets/gallery-living.jpg";
import galleryBedroomAcImage from "@/assets/gallery-bedroom-ac.jpg";
import galleryBedroomImage from "@/assets/gallery-bedroom.jpg";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatBot } from "@/components/ChatBot";

const roomOptions = {
  "2bhk": { name: "2BHK Full Home", price: "₹8,000/night", shortPrice: "₹8,000/nt" },
  "1bhk": { name: "1BHK Suite", price: "₹6,000/night", shortPrice: "₹6,000/nt" },
} as const;

// Homestay location — https://maps.app.goo.gl/oQz3TU99UmVD7Mkv8
const MAP_COORDS = "10.948146,78.090461";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${MAP_COORDS}&hl=en&z=16&output=embed`;
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${MAP_COORDS}`;

type RoomType = keyof typeof roomOptions;
type BookingValues = {
  name: string;
  phone: string;
  email: string;
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  guests: string;
};
type BookedRange = { start: string; end: string };
type Confirmation = BookingValues & { bookingId: string; demo: boolean };

const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name.").max(100),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+ ()-]{8,18}$/, "Please enter a valid phone number."),
    email: z.string().trim().email("Please enter a valid email address.").max(255),
    roomType: z.enum(["2bhk", "1bhk"]),
    checkIn: z.string().min(1, "Choose a check-in date."),
    checkOut: z.string().min(1, "Choose a check-out date."),
    guests: z.string().min(1),
  })
  .refine((data) => !data.checkIn || !data.checkOut || data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in.",
    path: ["checkOut"],
  });

function dateOffset(days: number) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

const defaultValues: BookingValues = {
  name: "",
  phone: "",
  email: "",
  roomType: "2bhk",
  checkIn: dateOffset(3),
  checkOut: dateOffset(6),
  guests: "2",
};

const navItems = [
  ["Overview", "home"],
  ["Rooms & Rates", "rooms"],
  ["Amenities", "amenities"],
  ["Gallery", "gallery"],
  ["Contact & Book", "booking"],
];

const amenities = [
  [Snowflake, "AC Rooms", "Fully air-conditioned bedrooms for complete relaxation."],
  [Droplets, "Purified RO Water", "Continuous multi-stage RO drinking water for health & safety."],
  [LockKeyhole, "Safety Lockers", "In-room safety lockers for guests' valuables."],
  [Gamepad2, "Free Board Games", "Complimentary indoor games for quality family time."],
  [CarFront, "Covered Reserved Parking", "Gated covered parking provided on-site completely free."],
  [GlassWater, "Welcome Drink", "Complimentary refreshing welcome beverage served on arrival."],
  [
    Sparkles,
    "Temple & Heritage Vicinity",
    "A 5-minute walk from the temple and Thirumurugan Mahal, amid historic sabhas and Carnatic culture.",
  ],
  [
    HeartHandshake,
    "Authentic Decor",
    "Clean, traditional homestyle aesthetic built for weddings and pilgrims.",
  ],
] as const;

const policyLinks = [
  ["Terms & Conditions", "/terms"],
  ["Privacy Policy", "/privacy"],
  ["Cancellation Policy", "/cancellation-policy"],
] as const;

const guestOptions = [...Array.from({ length: 14 }, (_, index) => String(index + 1)), "15+"];

const API_BASE =
  (import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:5000/api";

function scrollToBooking() {
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function datesOverlap(checkIn: string, checkOut: string, range: BookedRange) {
  return checkIn < range.end && checkOut > range.start;
}

function Brand({ inverted = false }: { inverted?: boolean }) {
  return (
    <a href="#home" className="group flex items-center gap-3" aria-label="RGN's Homestay home">
      <span
        className={`grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 shadow-sm ${inverted ? "border-hero-foreground/50" : "border-gold"}`}
      >
        <img src={logoMark} alt="" className="size-full object-cover" width={88} height={88} />
      </span>
      <span
        className={`hidden font-display text-lg font-semibold sm:block ${inverted ? "text-hero-foreground" : "text-foreground"}`}
      >
        RGN's Homestay
      </span>
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="reveal mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-bold uppercase text-primary">{eyebrow}</p>
      <h2 className="font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {copy ? <p className="mt-4 leading-7 text-muted-foreground">{copy}</p> : null}
      <div className="kolam-rule mx-auto mt-6" aria-hidden="true" />
    </div>
  );
}

// Ordered as a walk-through of the house: entrance, then the hall, then rooms.
const galleryPhotos = [
  {
    src: galleryEntranceImage,
    title: "Welcome Entrance",
    caption: "Tiled-roof frontage with gated parking",
  },
  { src: galleryHallImage, title: "Spacious Hall", caption: "Cane swing, TV & sofa seating" },
  { src: galleryLivingImage, title: "Living Room", caption: "Bright, airy family lounge" },
  {
    src: galleryBedroomAcImage,
    title: "Air-Conditioned Bedroom",
    caption: "Two beds with AC & pedestal fan",
  },
  { src: galleryBedroomImage, title: "Family Bedroom", caption: "Double bed plus a single cot" },
];

function GalleryCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="reveal mx-auto max-w-5xl">
      <Carousel setApi={setApi} opts={{ loop: true }} aria-label="Homestay photo gallery">
        <CarouselContent>
          {galleryPhotos.map((photo, index) => (
            <CarouselItem key={photo.title}>
              <figure className="relative overflow-hidden rounded-3xl">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  width={1600}
                  height={1200}
                  className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gallery-caption px-5 pb-4 pt-10 text-hero-foreground sm:p-8 sm:pb-10 sm:pt-16">
                  <p className="font-display text-lg font-semibold sm:text-2xl">{photo.title}</p>
                  <p className="mt-0.5 text-xs text-hero-muted sm:mt-1 sm:text-sm">
                    {photo.caption}
                  </p>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 h-10 w-10 border-0 bg-background/80 backdrop-blur hover:bg-background sm:left-5" />
        <CarouselNext className="right-3 h-10 w-10 border-0 bg-background/80 backdrop-blur hover:bg-background sm:right-5" />
      </Carousel>
      <div className="mt-5 flex items-center justify-center gap-2">
        {galleryPhotos.map((photo, index) => (
          <button
            key={photo.title}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Show photo ${index + 1}: ${photo.title}`}
            aria-current={current === index}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground" aria-live="polite">
        {current + 1} / {galleryPhotos.length} · Swipe or use the arrows
      </p>
    </div>
  );
}

// Persistent bottom CTA rail for mobile, so "Reserve Stay" is always one tap
// away while browsing rooms/amenities/gallery. Hides once the real booking
// form scrolls into view, and stays hidden past it (rather than reappearing
// over the footer) since the form itself is already the CTA at that point.
function MobileBookingBar() {
  const [pastHero, setPastHero] = useState(false);
  const [bookingInView, setBookingInView] = useState(false);
  const [pastBooking, setPastBooking] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const bookingEl = document.getElementById("booking");
    if (!bookingEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setBookingInView(entry.isIntersecting);
        // Once scrolled fully past (section's bottom above the viewport),
        // keep the bar hidden for the rest of the page (gallery footer,
        // policies, etc.) instead of it popping back up over that content.
        if (!entry.isIntersecting) setPastBooking(entry.boundingClientRect.top < 0);
      },
      { threshold: 0.2 },
    );
    observer.observe(bookingEl);
    return () => observer.disconnect();
  }, []);

  if (!pastHero || bookingInView || pastBooking) return null;

  return (
    <div className="fixed bottom-4 left-4 right-24 z-40 lg:hidden">
      <div className="flex items-center justify-between gap-3 rounded-full border border-border bg-card/95 py-2.5 pl-5 pr-2.5 shadow-float backdrop-blur-xl">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
            From
          </p>
          <p className="font-display text-lg font-semibold leading-tight text-primary">
            ₹6,000/night
          </p>
        </div>
        <Button asChild className="h-11 shrink-0 rounded-full px-5">
          <a href="#booking">Reserve Stay</a>
        </Button>
      </div>
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled || open ? "border-b border-border bg-background/95 shadow-warm backdrop-blur-xl" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Brand inverted={!scrolled && !open} />
        <nav
          className={`hidden items-center gap-1 rounded-full p-1 lg:flex ${scrolled ? "bg-secondary" : "bg-hero-foreground/10 backdrop-blur-md"}`}
          aria-label="Main navigation"
        >
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${scrolled ? "text-foreground hover:bg-card" : "text-hero-foreground hover:bg-hero-foreground/15"}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden h-11 rounded-full px-5 sm:inline-flex">
            <a href="#booking">Reserve Stay</a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full lg:hidden ${!scrolled && !open ? "text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground" : ""}`}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open ? (
        <nav
          className="border-t border-border bg-background px-5 pb-5 pt-3 lg:hidden"
          aria-label="Mobile navigation"
        >
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 font-semibold text-foreground hover:bg-secondary"
            >
              {label}
            </a>
          ))}
          <Button asChild className="mt-3 w-full rounded-full">
            <a href="#booking" onClick={() => setOpen(false)}>
              Reserve Stay
            </a>
          </Button>
        </nav>
      ) : null}
    </header>
  );
}

function QuickSearch({
  values,
  update,
}: {
  values: BookingValues;
  update: (values: Partial<BookingValues>) => void;
}) {
  return (
    <div className="hero-search shadow-float mx-auto grid w-[calc(100%-2rem)] max-w-6xl gap-3 rounded-3xl border border-border bg-card p-3 lg:grid-cols-[1.25fr_1fr_1fr_auto] lg:rounded-full lg:p-2">
      <label className="flex min-w-0 flex-col px-4 py-2 text-xs font-bold text-primary">
        Accommodation
        <span className="relative mt-1">
          <select
            value={values.roomType}
            onChange={(event) => update({ roomType: event.target.value as RoomType })}
            className="w-full appearance-none bg-transparent pr-7 text-base font-semibold text-foreground outline-none md:text-sm"
          >
            <option value="2bhk">2BHK Full Home (₹8,000/nt)</option>
            <option value="1bhk">1BHK Suite (₹6,000/nt)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-0 size-4 text-muted-foreground" />
        </span>
      </label>
      <label className="border-border px-4 py-2 text-xs font-bold text-primary lg:border-l">
        Check-in (2:00 PM)
        <Input
          type="date"
          min={dateOffset(1)}
          value={values.checkIn}
          onChange={(event) => update({ checkIn: event.target.value })}
          className="mt-1 h-auto border-0 p-0 font-semibold shadow-none focus-visible:ring-0"
        />
      </label>
      <label className="border-border px-4 py-2 text-xs font-bold text-primary lg:border-l">
        Check-out (2:00 PM)
        <Input
          type="date"
          min={values.checkIn || dateOffset(2)}
          value={values.checkOut}
          onChange={(event) => update({ checkOut: event.target.value })}
          className="mt-1 h-auto border-0 p-0 font-semibold shadow-none focus-visible:ring-0"
        />
      </label>
      <Button className="h-14 rounded-full px-6" onClick={scrollToBooking}>
        Check Availability <ArrowRight />
      </Button>
    </div>
  );
}

function RoomCard({
  type,
  values,
  update,
}: {
  type: RoomType;
  values: BookingValues;
  update: (values: Partial<BookingValues>) => void;
}) {
  const isHome = type === "2bhk";
  return (
    <article className="reveal lift-card overflow-hidden rounded-3xl border border-border bg-card shadow-warm">
      <div className="relative overflow-hidden">
        <img
          src={isHome ? homeImage : suiteImage}
          alt={
            isHome ? "Spacious traditional 2BHK living room" : "Serene air-conditioned 1BHK bedroom"
          }
          loading="lazy"
          width={1408}
          height={992}
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 hover:scale-[1.035]"
        />
        <span className="absolute left-5 top-5 rounded-full bg-highlight px-4 py-2 text-xs font-bold text-highlight-foreground shadow-sm">
          {isHome ? "Family & Wedding Stay" : "Pilgrim & Couple Suite"}
        </span>
      </div>
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-3xl font-semibold text-foreground">
            {roomOptions[type].name}
          </h3>
          <p className="shrink-0 text-right text-lg font-bold text-primary">
            {roomOptions[type].price}
          </p>
        </div>
        <p className="mt-4 leading-7 text-muted-foreground">
          {isHome
            ? "Full spacious residence featuring AC bedrooms, attached modern bathrooms, RO water filter, safety lockers, and free board games."
            : "Private serene suite featuring AC bedroom, living hall, purified RO drinking water, safety lockers, and quiet ambience."}
        </p>
        <ul className="my-6 space-y-3 text-sm text-foreground">
          {[
            "Cleaning charge ₹500 (one-time)",
            "Covered Reserved Parking – Free",
            "Welcome Drink Included",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="grid size-6 place-items-center rounded-full bg-gold-soft text-gold">
                <Check className="size-3.5" />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          className="h-auto w-full whitespace-normal rounded-full border-primary px-5 py-3 text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => {
            update({ roomType: type });
            scrollToBooking();
          }}
        >
          Select {roomOptions[type].name} ({roomOptions[type].shortPrice})
        </Button>
      </div>
    </article>
  );
}

function BookingForm({
  values,
  update,
}: {
  values: BookingValues;
  update: (values: Partial<BookingValues>) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [apiOffline, setApiOffline] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [agreed, setAgreed] = useState(false);
  // Honeypot: invisible to real guests; a bot that fills every input will
  // populate this, and the backend silently rejects the submission.
  const [company, setCompany] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/booked-dates?roomType=${encodeURIComponent(values.roomType)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        const data = (await response.json()) as { bookedRanges?: BookedRange[] };
        setBookedRanges(Array.isArray(data.bookedRanges) ? data.bookedRanges : []);
        setApiOffline(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setBookedRanges([]);
        setApiOffline(true);
      });
    return () => controller.abort();
  }, [values.roomType]);

  const conflicts = useMemo(
    () => bookedRanges.some((range) => datesOverlap(values.checkIn, values.checkOut, range)),
    [bookedRanges, values.checkIn, values.checkOut],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setErrors({});
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
        ),
      );
      return;
    }
    if (conflicts) {
      setErrors({
        form: "Those dates overlap an existing reservation. Please choose another stay.",
      });
      return;
    }
    if (!agreed) {
      setErrors({ form: "Please agree to the Terms & Conditions and Privacy Policy to continue." });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, company }),
      });
      const data = (await response.json()) as {
        success: boolean;
        bookingId?: string;
        message?: string;
      };
      if (!response.ok || !data.success || !data.bookingId) {
        setErrors({
          form:
            data.message ||
            "We could not complete that request. Please check your dates and try again.",
        });
        return;
      }
      setConfirmation({ ...parsed.data, bookingId: data.bookingId, demo: false });
    } catch {
      setApiOffline(true);
      setConfirmation({
        ...parsed.data,
        bookingId: `RGN-DEMO-${Date.now().toString().slice(-6)}`,
        demo: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div
        className="rounded-3xl border border-border bg-card p-6 shadow-warm md:p-10"
        aria-live="polite"
      >
        <p className="text-xs font-bold uppercase text-primary">Namaskaram</p>
        <div className="mt-4 flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold-soft text-gold">
            <CircleCheck />
          </span>
          <div>
            <h3 className="font-display text-3xl font-semibold">Booking Confirmed! 🙏</h3>
            <p className="mt-2 leading-7 text-muted-foreground">
              Thank you for choosing RGN's Homestay. Your room request has been sent to Mrs S Gowri
              and recorded.
            </p>
          </div>
        </div>
        {confirmation.demo ? (
          <p className="mt-5 rounded-xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-foreground">
            Demo mode: the booking service is currently unreachable, so this confirmation is for
            testing and has not been sent to the host.
          </p>
        ) : null}
        <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {[
            ["Booking ID", confirmation.bookingId],
            ["Reserved Space", roomOptions[confirmation.roomType].name],
            [
              "Stay Dates",
              `${formatDate(confirmation.checkIn)} — ${formatDate(confirmation.checkOut)}`,
            ],
            ["Guest Name", confirmation.name],
          ].map(([term, detail]) => (
            <div key={term} className="bg-secondary p-4">
              <dt className="text-xs font-bold uppercase text-primary">{term}</dt>
              <dd className="mt-1 font-semibold text-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-7 rounded-2xl bg-primary p-5 text-primary-foreground">
          <p className="font-display text-xl font-semibold">Mrs S Gowri — Direct Resident Host</p>
          <p className="mt-1 text-sm opacity-80">
            For arrival coordination or questions, contact your host directly.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="rounded-full">
              <a href="tel:+917010775902">
                <Phone /> Call Host
              </a>
            </Button>
            <Button asChild variant="secondary" className="rounded-full">
              <a
                href="https://api.whatsapp.com/send/?phone=%2B917010775902&text&type=phone_number&app_absent=0&wame_ctl=1"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-5 rounded-full text-primary"
          onClick={() => setConfirmation(null)}
        >
          <ArrowLeft /> Make Another Reservation
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-3xl border border-border bg-card p-6 shadow-warm md:p-10"
    >
      <p className="text-xs font-bold uppercase text-primary">Direct Booking</p>
      <h3 className="mt-3 font-display text-3xl font-semibold text-foreground">
        Guest Reservation Form
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Managed directly by Mrs S Gowri with zero platform commissions.
      </p>
      {apiOffline ? (
        <p className="mt-5 rounded-xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm">
          Live availability is temporarily unavailable. Demo mode keeps the form testable.
        </p>
      ) : null}
      {errors["form"] ? (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {errors["form"]}
        </p>
      ) : null}
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full Name*" error={errors["name"]}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            maxLength={100}
            value={values.name}
            onChange={(e) => update({ name: e.target.value })}
            aria-invalid={Boolean(errors["name"])}
          />
        </Field>
        <Field id="phone" label="Phone Number*" error={errors["phone"]}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={18}
            placeholder="7010775902"
            value={values.phone}
            onChange={(e) => update({ phone: e.target.value })}
            aria-invalid={Boolean(errors["phone"])}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="email" label="Email Address*" error={errors["email"]}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={255}
              placeholder="guest@example.com"
              value={values.email}
              onChange={(e) => update({ email: e.target.value })}
              aria-invalid={Boolean(errors["email"])}
            />
          </Field>
        </div>
      </div>
      <fieldset className="mt-6">
        <legend className="text-sm font-bold text-foreground">Preferred Accommodation*</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(Object.keys(roomOptions) as RoomType[]).map((type) => (
            <label
              key={type}
              className={`cursor-pointer rounded-2xl border p-4 transition-all ${values.roomType === type ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-gold"}`}
            >
              <input
                type="radio"
                name="roomType"
                value={type}
                checked={values.roomType === type}
                onChange={() => update({ roomType: type })}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="block font-bold text-foreground">{roomOptions[type].name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {roomOptions[type].price} + ₹500 cleaning
                  </span>
                </span>
                <span
                  className={`grid size-5 place-items-center rounded-full border ${values.roomType === type ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                >
                  {values.roomType === type ? <Check className="size-3" /> : null}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <Field id="checkIn" label="Check-in*" error={errors["checkIn"]}>
          <Input
            id="checkIn"
            type="date"
            min={dateOffset(1)}
            value={values.checkIn}
            onChange={(e) => update({ checkIn: e.target.value })}
          />
        </Field>
        <Field id="checkOut" label="Check-out*" error={errors["checkOut"]}>
          <Input
            id="checkOut"
            type="date"
            min={values.checkIn || dateOffset(2)}
            value={values.checkOut}
            onChange={(e) => update({ checkOut: e.target.value })}
          />
        </Field>
        <Field id="guests" label="Guests*" error={errors["guests"]}>
          <select
            id="guests"
            value={values.guests}
            onChange={(e) => update({ guests: e.target.value })}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-base outline-none focus:ring-2 focus:ring-ring md:text-sm"
          >
            {guestOptions.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {bookedRanges.length ? (
        <div className="mt-4 text-xs text-muted-foreground">
          <strong className="text-foreground">Unavailable:</strong>{" "}
          {bookedRanges
            .map((range) => `${formatDate(range.start)}–${formatDate(range.end)}`)
            .join(", ")}
        </div>
      ) : null}
      {conflicts ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-destructive">
          Selected dates are already booked for this accommodation.
        </p>
      ) : null}

      {/* Honeypot: hidden from sighted and screen-reader users, but present in the DOM for bots that auto-fill every field. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <label className="mt-6 flex items-start gap-2.5 text-xs leading-5 text-muted-foreground">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
        />
        <span>
          I agree to the{" "}
          <Link
            to="/terms"
            target="_blank"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Terms &amp; Conditions
          </Link>
          ,{" "}
          <Link
            to="/privacy"
            target="_blank"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          , and{" "}
          <Link
            to="/cancellation-policy"
            target="_blank"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Cancellation Policy
          </Link>
          .
        </span>
      </label>

      <Button
        type="submit"
        disabled={submitting || conflicts || !agreed}
        className="mt-5 h-12 w-full rounded-full text-base"
      >
        {submitting ? "Confirming…" : "Confirm Booking Request"}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        No platform fees. The host will contact you directly.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block font-bold">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function HomestayPage() {
  const [values, setValues] = useState<BookingValues>(defaultValues);
  const update = (partial: Partial<BookingValues>) =>
    setValues((current) => ({ ...current, ...partial }));

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-clip bg-background text-foreground">
      <Header />
      <main>
        <section
          id="home"
          className="relative flex min-h-[760px] items-end bg-cover bg-center pb-32 pt-32 md:min-h-[85vh] md:pb-36"
          style={{
            backgroundImage: `linear-gradient(to bottom, color-mix(in oklab, var(--overlay) 35%, transparent), color-mix(in oklab, var(--overlay) 88%, transparent)), url(${heroImage})`,
          }}
        >
          <div className="mx-auto w-full max-w-7xl px-5 pb-10 lg:px-8">
            <div className="max-w-3xl text-center md:text-left">
              <div className="mb-6 flex flex-wrap justify-center gap-2 md:justify-start">
                <span className="rounded-full border border-hero-foreground/25 bg-hero-foreground/10 px-4 py-2 text-xs font-bold text-hero-foreground backdrop-blur-md">
                  Karur • Homestyle Retreat
                </span>
                <span className="flex items-center gap-2 rounded-full bg-highlight px-4 py-2 text-xs font-bold text-highlight-foreground">
                  <Star className="size-3.5 fill-current" /> 4.98 — Homestay Verified • Mrs S Gowri
                  Host
                </span>
              </div>
              <h1 className="font-display text-5xl font-semibold leading-[1.04] text-hero-foreground sm:text-6xl md:text-7xl">
                Your Comfort,
                <br />
                Our Tradition.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-hero-muted md:text-lg">
                Stay in the heart of Karur, moments from the sacred hills of South-Based Tirupati —
                the revered Arulmigu Kalyana Venkataramana Swamy Temple. A home-style homestay built
                for family, weddings, and pilgrims alike, offering warm hospitality just steps from
                the marriage mahal and centuries of tradition.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2 md:justify-start">
                {[
                  [GlassWater, "Welcome Drink Included"],
                  [CarFront, "Covered Reserved Parking – Free"],
                  [CalendarDays, "Check-in 2:00 PM • Check-out 2:00 PM"],
                ].map(([Icon, label]) => {
                  const ItemIcon = Icon as typeof GlassWater;
                  return (
                    <span
                      key={label as string}
                      className="flex items-center gap-2 rounded-full border border-hero-foreground/20 bg-hero-foreground/10 px-4 py-2 text-xs font-semibold text-hero-foreground backdrop-blur-md"
                    >
                      <ItemIcon className="size-4" />
                      {label as string}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 translate-y-1/2">
            <QuickSearch values={values} update={update} />
          </div>
        </section>

        <section id="rooms" className="scroll-mt-24 px-5 pb-24 pt-36 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Living Spaces"
              title="Homestyle Accommodations"
              copy="Equipped with AC rooms, purified RO water, safety lockers, and free covered parking."
            />
            <div className="grid gap-7 lg:grid-cols-2">
              <RoomCard type="2bhk" values={values} update={update} />
              <RoomCard type="1bhk" values={values} update={update} />
            </div>
          </div>
        </section>

        <section
          id="amenities"
          className="scroll-mt-20 border-y border-border bg-secondary px-5 py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Homestay Comforts" title="Homestay Facilities" />
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {amenities.map(([Icon, title, description]) => (
                <article key={title} className="reveal group">
                  <span className="grid size-14 place-items-center rounded-full border border-gold bg-card text-primary shadow-sm transition-transform group-hover:-translate-y-1">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-20 px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Visual Archive" title="Homestay Gallery" />
            <GalleryCarousel />
          </div>
        </section>

        <section
          id="booking"
          className="scroll-mt-16 border-t border-border bg-secondary px-5 py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="A Warm Welcome Awaits"
              title="Contact & Book Your Stay"
              copy="Plan your visit directly with your resident host in Karur."
            />
            <div className="grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="space-y-6">
                <article className="reveal rounded-3xl bg-primary p-7 text-primary-foreground shadow-warm md:p-9">
                  <div className="flex items-center gap-4">
                    <span className="grid size-14 place-items-center rounded-full border border-primary-foreground/30 font-display font-bold">
                      SG
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase text-gold-light">Your Host</p>
                      <h3 className="font-display text-2xl font-semibold">Mrs S Gowri</h3>
                      <p className="text-sm opacity-75">Direct Resident Host</p>
                    </div>
                  </div>
                  <div className="mt-7 space-y-4 text-sm leading-6">
                    <p className="flex gap-3">
                      <MapPin className="mt-1 size-4 shrink-0 text-gold-light" />
                      25/4 Kamaraj Nagar, Sungagate, Near Sungagate Bus stop, Thanthonimalai Post,
                      Karur-639004
                    </p>
                    <a href="tel:+917010775902" className="flex gap-3 hover:text-gold-light">
                      <Phone className="size-4 text-gold-light" />
                      +91 70107 75902
                    </a>
                    <a
                      href="mailto:rgnshomestay@gmail.com"
                      className="flex gap-3 break-all hover:text-gold-light"
                    >
                      <Mail className="size-4 shrink-0 text-gold-light" />
                      rgnshomestay@gmail.com
                    </a>
                    <p className="flex gap-3">
                      <CalendarDays className="size-4 shrink-0 text-gold-light" />
                      Check-in 2:00 PM • Check-out 2:00 PM
                    </p>
                  </div>
                  <Button asChild variant="secondary" className="mt-7 h-12 w-full rounded-full">
                    <a
                      href="https://api.whatsapp.com/send/?phone=%2B917010775902&text&type=phone_number&app_absent=0&wame_ctl=1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink /> Direct WhatsApp (+91 70107 75902)
                    </a>
                  </Button>
                </article>
                <article className="reveal rounded-3xl border border-border bg-card p-7 shadow-warm">
                  <p className="text-xs font-bold uppercase text-primary">Location Highlight</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold">
                    10 Mins Walk to Sri Thanthonimalai Perumal Temple
                  </h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    Situated just 5 minutes walk from Sri Thanthonimalai Perumal Temple and
                    Thirumurugan Mahal.
                  </p>
                  <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-primary">
                    <MapPin className="size-5" /> Thanthonimalai, Karur
                  </div>
                  <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                    <iframe
                      title="RGN's Homestay location on Google Maps"
                      src={MAP_EMBED_SRC}
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <Button asChild variant="outline" className="mt-4 h-11 w-full rounded-full">
                    <a href={MAP_DIRECTIONS_URL} target="_blank" rel="noreferrer">
                      <MapPin /> Get Directions
                    </a>
                  </Button>
                </article>
              </div>
              <BookingForm values={values} update={update} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-4 border-gold bg-footer px-5 py-16 text-footer-foreground lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <Brand inverted />
            <p className="mt-5 max-w-sm text-sm leading-7 text-footer-muted">
              Stay in the heart of Karur, moments from the sacred hills of Arulmigu Kalyana
              Venkataramana Swamy Temple. Built for family, weddings, and pilgrims.
            </p>
            <p className="mt-5 text-sm">
              <span className="text-footer-muted">Host Manager</span>
              <br />
              <strong>Mrs S Gowri</strong>
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">Reach Us</h3>
            <div className="mt-5 space-y-3 text-sm leading-6 text-footer-muted">
              <p>
                25/4 Kamaraj Nagar, Sungagate, Near Sungagate Bus stop, Thanthonimalai Post,
                Karur-639004
              </p>
              <a className="block hover:text-gold-light" href="tel:+917010775902">
                +91 70107 75902
              </a>
              <a
                className="block break-all hover:text-gold-light"
                href="mailto:rgnshomestay@gmail.com"
              >
                rgnshomestay@gmail.com
              </a>
              <p>Check-in 2:00 PM • Check-out 2:00 PM</p>
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">Homestay Policies</h3>
            <div className="mt-5 flex flex-col items-start gap-3">
              {policyLinks.map(([title, href]) => (
                <Link
                  key={title}
                  to={href}
                  className="text-sm font-semibold text-footer-muted hover:text-gold-light"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-footer-foreground/15 pt-6 text-xs text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 RGN's Homestay Homestyle Living.</p>
          <p>Your Comfort, Our Tradition.</p>
        </div>
      </footer>
      <MobileBookingBar />
      <ChatBot />
    </div>
  );
}
