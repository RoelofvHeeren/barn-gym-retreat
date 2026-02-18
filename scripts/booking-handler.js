/**
 * Booking Handler Script
 * Handles gathering form data and sending it to external services (GoHighLevel / Email).
 */

async function submitBooking(formData) {
    console.log('🚀 Submitting booking...', formData);

    // URL for Backend API
    // const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID'; 
    const API_URL = '/api/booking';

    try {
        // Construct the Name: Company x Venue
        const companyName = formData.companyName || 'Unknown Company';
        const venueName = formData.venue || 'No Venue';
        const opportunityName = `${companyName} x ${venueName}`;

        // Estimate value (rough logic based on duration/guests/venue)
        // This is a placeholder logic, user might want more specific calcs
        const guestCount = parseInt(formData.guestCount) || 0;
        const duration = parseInt(formData.duration) || 0;
        let baseRate = 2000; // default
        if (venueName.toLowerCase().includes('bell')) baseRate = 3000;
        if (venueName.toLowerCase().includes('eastwood')) baseRate = 3500;
        if (venueName.toLowerCase().includes('oast')) baseRate = 4000;

        const ESTIMATED_VALUE = baseRate * duration; // Very rough estimate

        // Prepare the payload matching GHL Webhook expectations
        // We structure it to pass custom fields easily if mapped in GHL
        // or as raw JSON for a workflow to parse.
        const payload = {
            ...formData,
            opportunity_name: opportunityName,
            opportunity_value: ESTIMATED_VALUE,
            tags: ['corporate_retreat'],
            customData: {
                corporate_venue: venueName,
                number_of_guests: formData.guestCount,
                duration: formData.duration,
                proposed_itinerary: formData.itinerary, // Assuming this comes from main form
                estimated_activity_cost: ESTIMATED_VALUE
            },
            submittedAt: new Date().toISOString(),
            source: 'Retreat Booking Embed'
        };

        // Send to Backend API
        console.log('Sending payload to Backend:', payload);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Server submission failed');
        }

        // Simulate success for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Booking submitted successfully!');
        return { success: true };

    } catch (error) {
        console.error('❌ Error submitting booking:', error);
        return { success: false, error: error.message };
    }
}

// Function to gather all data from the wizard state
function collectBookingData() {
    // These IDs must match your HTML input IDs
    const guestCount = document.getElementById('guest-count')?.value || 'N/A';
    const duration = document.getElementById('duration')?.value || 'N/A';
    const month = document.getElementById('month')?.value || 'N/A';

    // Get selected venue
    // Update: logic to grab from card-option.selected or fallback
    let venue = 'Not Selected';
    const selectedCard = document.querySelector('.card-option.selected');
    if (selectedCard) {
        const h3 = selectedCard.querySelector('h3');
        if (h3) venue = h3.innerText.trim();
    }

    // Get selected known activities
    const selectedActivities = Array.from(document.querySelectorAll('.activity-card.selected .activity-content span'))
        .map(el => el.innerText);

    // Contact Details
    const name = document.getElementById('contact-name')?.value || '';
    const email = document.getElementById('contact-email')?.value || '';
    const companyName = document.getElementById('contact-company')?.value || '';
    const phone = document.getElementById('contact-phone')?.value || '';

    // Itinerary - naive grab of text
    const itineraryList = document.getElementById('itinerary-list');
    const itinerary = itineraryList ? itineraryList.innerText : '';

    return {
        venue,
        guestCount,
        duration,
        month,
        activities: selectedActivities,
        name,
        email,
        companyName,
        phone,
        itinerary
    };
}

// Global expose
window.submitBookingHandler = async () => {
    const data = collectBookingData();

    // Show loading state (Simple alert or UI change)
    const submitBtn = document.querySelector('#btn-finish'); // Assume there is a finish button
    if (submitBtn) {
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        const result = await submitBooking(data);

        if (result.success) {
            submitBtn.innerText = 'Request Sent!';
            alert('Thank you! Your retreat request has been sent. We will be in touch shortly.');
            // Optional: Reset form or redirect
        } else {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            alert('There was an error sending your request. Please try again.');
        }
    } else {
        // If no button found, just run it
        await submitBooking(data);
    }
};
