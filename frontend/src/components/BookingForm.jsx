import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import ConfirmationScreen from './ConfirmationScreen';
import { fetchBookedDates, submitBooking } from '../api';

export default function BookingForm() {
  const [roomType, setRoomType] = useState('2bhk');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [bookedRanges, setBookedRanges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedData, setConfirmedData] = useState(null);

  useEffect(() => {
    const today = new Date();
    const inDate = new Date(today);
    inDate.setDate(today.getDate() + 3);
    const outDate = new Date(today);
    outDate.setDate(today.getDate() + 6);

    const fmt = d => d.toISOString().split('T')[0];
    setCheckIn(fmt(inDate));
    setCheckOut(fmt(outDate));
  }, []);

  useEffect(() => {
    async function loadBookedDates() {
      const res = await fetchBookedDates(roomType);
      if (res && res.bookedRanges) {
        setBookedRanges(res.bookedRanges);
      }
    }
    loadBookedDates();
  }, [roomType]);

  const handleDateChange = (field, value) => {
    setErrorMsg('');
    if (field === 'checkIn') setCheckIn(value);
    if (field === 'checkOut') setCheckOut(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !phone || !email || !checkIn || !checkOut) {
      setErrorMsg('Please fill in all required booking details.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg('Check-out date must be strictly after check-in date.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await submitBooking({
        name,
        phone,
        email,
        roomType,
        checkIn,
        checkOut,
        guests: Number(guests)
      });

      if (response && response.success) {
        setConfirmedData({
          ...response,
          roomType,
          checkIn,
          checkOut,
          name
        });
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMsg(err.message || 'Failed to complete reservation. Please select different dates or contact host.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setConfirmedData(null);
    setErrorMsg('');
    setName('');
    setPhone('');
    setEmail('');
  };

  if (confirmedData) {
    return <ConfirmationScreen bookingData={confirmedData} onReset={handleReset} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container-lowest/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-primary/30 text-on-surface">
      <div className="flex flex-col gap-1 mb-6 border-b border-primary/20 pb-4">
        <span className="font-label-editorial text-secondary uppercase tracking-wider text-xs font-bold">
          Direct Host Reservation
        </span>
        <h2 className="font-headline-sm text-2xl text-primary font-bold">
          Reserve Your Homestay Stay
        </h2>
        <p className="text-xs text-on-surface-variant">
          Managed by Mrs S Gowri • Check-in 2:00 PM / Check-out 2:00 PM
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2 border border-error/20 font-medium">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Room Type Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">bed</span>
            Select Living Space
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="roomType"
                value="2bhk"
                checked={roomType === '2bhk'}
                onChange={() => setRoomType('2bhk')}
                className="sr-only peer"
              />
              <div className="p-4 rounded-2xl bg-surface-container-low peer-checked:bg-primary-container peer-checked:text-white transition-all border border-primary/20 flex flex-col gap-1">
                <span className="font-bold text-sm">2BHK Full Home</span>
                <span className="text-xs font-bold text-secondary peer-checked:text-white">₹8,000 <span class="font-normal opacity-80">/ night</span></span>
                <span className="text-[11px] opacity-75">+ ₹500 cleaning charge</span>
              </div>
            </label>

            <label className="cursor-pointer">
              <input
                type="radio"
                name="roomType"
                value="1bhk"
                checked={roomType === '1bhk'}
                onChange={() => setRoomType('1bhk')}
                className="sr-only peer"
              />
              <div className="p-4 rounded-2xl bg-surface-container-low peer-checked:bg-primary-container peer-checked:text-white transition-all border border-primary/20 flex flex-col gap-1">
                <span className="font-bold text-sm">1BHK Suite</span>
                <span className="text-xs font-bold text-secondary peer-checked:text-white">₹6,000 <span class="font-normal opacity-80">/ night</span></span>
                <span class="text-[11px] opacity-75">+ ₹500 cleaning charge</span>
              </div>
            </label>
          </div>
        </div>

        {/* Date Range Picker */}
        <Calendar
          bookedRanges={bookedRanges}
          checkIn={checkIn}
          checkOut={checkOut}
          onDateChange={handleDateChange}
        />

        {/* Guest Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
              Guest Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Priya Raman"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs outline-none border border-primary/30 focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">group</span>
              Number of Guests
            </label>
            <select
              value={guests}
              onChange={e => setGuests(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs outline-none border border-primary/30 focus:border-primary"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5 Guests</option>
              <option value="6">6+ Guests</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
              Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="7010775902"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs outline-none border border-primary/30 focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">mail</span>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="guest@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs outline-none border border-primary/30 focus:border-primary"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-container text-white py-4 px-6 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 border border-primary/40 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              <span>Re-validating Dates & Booking...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
              <span>Confirm Reservation ({roomType === '2bhk' ? '₹8,000' : '₹6,000'})</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
