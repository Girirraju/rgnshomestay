import React from 'react';

/**
 * Calendar component that visually renders check-in/out selection
 * and greys out unavailable booked date ranges.
 */
export default function Calendar({ bookedRanges = [], checkIn, checkOut, onDateChange }) {
  // Helper to check if a YYYY-MM-DD date is booked
  const isDateBooked = (dateStr) => {
    if (!dateStr) return false;
    const target = new Date(dateStr).getTime();
    return bookedRanges.some(range => {
      const start = new Date(range.start).getTime();
      const end = new Date(range.end).getTime();
      return target >= start && target < end;
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
      <div className="flex items-center justify-between">
        <span className="font-label-editorial text-secondary uppercase tracking-wider text-xs">
          Select Itinerary Dates
        </span>
        {bookedRanges.length > 0 && (
          <span className="text-xs text-primary font-medium bg-secondary-fixed px-2.5 py-1 rounded-full">
            {bookedRanges.length} Locked Slot(s) Greyed Out
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Check-In Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="checkIn" className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary">login</span>
            Check-in Date (From 12:00 PM)
          </label>
          <input
            type="date"
            id="checkIn"
            name="checkIn"
            min={todayStr}
            value={checkIn}
            onChange={(e) => onDateChange('checkIn', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface outline-none font-body-md transition-all"
            required
          />
          {checkIn && isDateBooked(checkIn) && (
            <p className="text-xs text-error flex items-center gap-1 font-medium mt-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              Selected Check-in date is already booked!
            </p>
          )}
        </div>

        {/* Check-Out Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="checkOut" className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary">logout</span>
            Check-out Date (Until 10:30 AM)
          </label>
          <input
            type="date"
            id="checkOut"
            name="checkOut"
            min={checkIn || todayStr}
            value={checkOut}
            onChange={(e) => onDateChange('checkOut', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface outline-none font-body-md transition-all"
            required
          />
          {checkOut && isDateBooked(checkOut) && (
            <p className="text-xs text-error flex items-center gap-1 font-medium mt-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              Selected Check-out date is already booked!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
