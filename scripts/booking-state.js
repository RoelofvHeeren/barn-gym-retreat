/**
 * Booking State Management
 * Handles saving and retrieving booking data across multiple pages using sessionStorage.
 */

const STORAGE_KEY = 'retreat_booking_state';

const defaultState = {
    location: null,      // e.g., "The Bell in Ticehurst"
    locationId: null,    // e.g., "bell"
    guestCount: 12,
    duration: '3 Days / 2 Nights',
    month: 'ASAP',
    activities: [],      // Array of strings
    contact: {
        name: '',
        email: '',
        company: '',
        phone: ''
    }
};

// Get current state or default
function getBookingState() {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...defaultState, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error('Error reading booking state', e);
    }
    return defaultState;
}

// Save partial or full state
function saveBookingState(data) {
    const current = getBookingState();
    const newState = { ...current, ...data };
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        console.log('State saved:', newState);
    } catch (e) {
        console.error('Error saving booking state', e);
    }
}

// Clear state (e.g., after successful submission or "Start Over")
function clearBookingState() {
    sessionStorage.removeItem(STORAGE_KEY);
}

// Debug helper
window.logState = () => console.log(getBookingState());
