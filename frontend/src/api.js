const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch booked date ranges for a room type (2bhk or 1bhk)
 * @param {string} roomType 
 * @returns {Promise<{ bookedRanges: Array<{start: string, end: string}> }>}
 */
export async function fetchBookedDates(roomType = '2bhk') {
  try {
    const response = await fetch(`${API_BASE_URL}/booked-dates?roomType=${encodeURIComponent(roomType)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch booked dates: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return { bookedRanges: [] };
  }
}

/**
 * Submit a booking request to the backend
 * @param {Object} payload 
 * @param {string} payload.name
 * @param {string} payload.phone
 * @param {string} payload.email
 * @param {string} payload.roomType
 * @param {string} payload.checkIn
 * @param {string} payload.checkOut
 * @param {number} payload.guests
 * @returns {Promise<{ success: boolean, bookingId: string, owner: { phone: string, email: string }, message?: string }>}
 */
export async function submitBooking(payload) {
  const response = await fetch(`${API_BASE_URL}/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Booking submission failed. Please try again.');
  }

  return data;
}
