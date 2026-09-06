import React from 'react';
import BookingForm from './components/BookingForm';

export default function App() {
  return (
    <div className="min-h-screen font-sans text-[#222222] bg-white">
      {/* Airbnb Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#FF385C] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
              RGN
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-[#222222]">RGN's Homestay</span>
              <span className="text-[11px] text-[#717171] font-medium">Homestyle Living • Karur</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-[#f7f7f7] border border-[#EBEBEB] p-1.5 rounded-full text-xs font-semibold text-[#222222]">
            <a href="#home" className="px-5 py-2 rounded-full bg-white shadow-sm">Overview</a>
            <a href="#rooms" className="px-5 py-2 rounded-full text-[#717171] hover:text-[#222222]">Rooms</a>
            <a href="#amenities" className="px-5 py-2 rounded-full text-[#717171] hover:text-[#222222]">Amenities</a>
            <a href="#booking" className="px-5 py-2 rounded-full text-[#717171] hover:text-[#222222]">Booking</a>
          </nav>

          <a href="#booking" className="bg-[#FF385C] hover:bg-[#E00B41] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-md transition-all">
            Reserve Stay
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-[1280px] mx-auto px-6 py-10 space-y-12">
        <section id="home" className="space-y-6">
          <div class="inline-flex items-center gap-2 bg-[#f7f7f7] border border-[#EBEBEB] text-[#FF385C] font-bold text-xs px-4 py-1.5 rounded-full shadow-sm">
            <span>✨ Karur • Homestyle Retreat</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#222222] tracking-tight">
            Your Comfort, <span className="text-[#FF385C] italic font-normal">Our Tradition.</span>
          </h1>

          <p className="text-base text-[#222222] bg-[#f7f7f7] border border-[#EBEBEB] p-6 rounded-3xl max-w-4xl leading-relaxed">
            Stay in the heart of Karur, moments from the sacred hills of South-Based Tirupati — the revered Arulmigu Kalyana Venkataramana Swamy Temple. A home-style homestay built for family, weddings, and pilgrims alike, offering warm hospitality just steps from the marriage mahal and centuries of tradition.
          </p>
        </section>

        {/* Booking Section */}
        <section id="booking" className="scroll-mt-24">
          <BookingForm />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f7f7f7] border-t border-[#EBEBEB] py-8 text-center text-xs text-[#717171] mt-16">
        <p>© 2026 RGN's Homestay Homestyle Living. Designed with Airbnb &amp; Pinterest minimalist white aesthetic.</p>
      </footer>
    </div>
  );
}
