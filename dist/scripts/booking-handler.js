/**
 * Booking Handler Script
 * Handles gathering form data and sending it to external services (GoHighLevel / Email).
 */

async function submitBooking(formData) {
    console.log('🚀 Submitting booking...', formData);

    // TODO: Replace with actual GoHighLevel Webhook URL provided by user
    const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID'; // Placeholder

    try {
        // Prepare the payload
        const payload = {
            ...formData,
            submittedAt: new Date().toISOString(),
            source: 'Retreat Booking Embed'
        };

        // Send to Webhook (GoHighLevel)
        // Note: usage of 'no-cors' might be needed depending on GHL settings, 
        // but 'cors' is better if supported to read response.
        // For now, we assume standard POST.

        /* 
        // UNCOMMENT WHEN WEBHOOK IS READY
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Webhook submission failed');
        }
        */

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
    const selectedVenueCard = document.querySelector('.card-option.selected h3');
    const venue = selectedVenueCard ? selectedVenueCard.innerText : 'Not Selected';

    // Get selected known activities
    const selectedActivities = Array.from(document.querySelectorAll('.activity-card.selected .activity-content span'))
        .map(el => el.innerText);

    return {
        venue,
        guestCount,
        duration,
        month,
        activities: selectedActivities
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
