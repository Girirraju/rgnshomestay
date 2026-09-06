import React from 'react';

export default function ConfirmationScreen({ bookingData, onReset }) {
  if (!bookingData) return null;

  const { bookingId, owner, roomType, checkIn, checkOut, name } = bookingData;

  const ownerPhone = owner?.phone || '+91 70107 75902';
  const ownerEmail = owner?.email || 'rgnshomestay@gmail.com';
  const whatsappUrl = 'https://api.whatsapp.com/send/?phone=%2B917010775902&text&type=phone_number&app_absent=0&wame_ctl=1';

  return (
    <div className="flex flex-col items-center text-center py-8 animate-fade-in max-w-lg mx-auto bg-surface-container-lowest/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-primary/40 text-on-surface">
      <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4 shadow-inner">
        <span className="material-symbols-outlined text-[36px]">verified</span>
      </div>

      <span className="font-label-editorial text-secondary uppercase tracking-widest block text-xs font-bold">
        Namaskaram 🙏
      </span>
      <h3 className="font-headline-md text-2xl text-primary font-bold mt-1">
        Your Booking Request is Confirmed!
      </h3>
      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
        Thank you for choosing RGN's Homestay Homestyle Living. Your reservation request has been logged and sent to Mrs S Gowri.
      </p>

      {/* Booking Details Card */}
      <div className="my-6 p-4 rounded-2xl bg-surface-container-low/90 w-full text-left space-y-2.5 border border-primary/20 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Booking ID:</span>
          <span className="font-mono font-bold text-primary text-sm">{bookingId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Room Type:</span>
          <span className="font-semibold text-on-surface">{roomType?.toUpperCase()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Stay Period (Check-in 2:00 PM / Out 2:00 PM):</span>
          <span className="font-semibold text-on-surface">{checkIn} to {checkOut}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Guest Name:</span>
          <span className="font-semibold text-on-surface">{name}</span>
        </div>
      </div>

      {/* Host Direct Contact Module */}
      <div className="w-full p-4 rounded-2xl bg-surface-container-low border border-primary/30 flex flex-col gap-3 text-left">
        <div>
          <span class="font-label-editorial text-secondary uppercase text-[10px] tracking-wider block font-bold">
            Direct Host Assistance
          </span>
          <p className="font-bold text-primary text-sm">Mrs S Gowri</p>
          <p className="text-[11px] text-on-surface-variant">Mobile: +91 70107 75902 | Mail: rgnshomestay@gmail.com</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <a
            href={`tel:${ownerPhone}`}
            className="flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Call Host</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-6 text-primary text-xs font-bold hover:underline flex items-center gap-1"
      >
        <span>← Make Another Reservation</span>
      </button>
    </div>
  );
}
