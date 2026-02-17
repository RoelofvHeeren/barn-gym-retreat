const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Endpoint for Booking
app.post('/api/booking', async (req, res) => {
    const apiKey = process.env.GHL_API_KEY;

    if (!apiKey) {
        console.error('❌ GHL_API_KEY is missing in environment variables');
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    try {
        const formData = req.body;
        console.log('📩 Received booking request for:', formData.companyName);

        // GHL API Call (Contacts/Opportunities)
        // Note: The specific endpoint depends on what the user wants to do (Create Contact, Opportunity, etc.)
        // This is a generic "Contact" creation or "Opportunity" creation example.
        // Assuming V2 API for GHL or V1? usually V2 is standard now but requires OAuth.
        // If the user provided a "Location API Key" (begins with pit-), it might be V1 or V2 Location Key.
        // Let's assume V1 for simplicity with "Authorization: Bearer <key>" or header "Authorization: Bearer <key>" 
        // effectively interacting with the GHL API.

        // HOWEVER, "pit-" keys are often "Location API Keys" for V2.
        // Let's try the standard contacts endpoint.

        const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify({
                locationId: process.env.GHL_LOCATION_ID || 'VYZcxHGdxD0Dj1cj1ZU4',
                name: formData.contactName,
                email: formData.contactEmail,
                phone: formData.contactPhone,
                companyName: formData.companyName,
                tags: ['retreat-inquiry'],
                customFields: [
                    { key: 'corporate_venue', value: formData.venueName }, // Mapped from venueName
                    { key: 'number_of_guests', value: formData.guestCount }, // Mapped from guestCount
                    { key: 'retreat_duration', value: formData.duration },
                    { key: 'preferred_month', value: formData.month },
                    { key: 'retreat_itinerary', value: formData.itineraryText },
                    { key: 'estimated_value', value: formData.opportunityValue }
                ]
            })
        });

        const data = await ghlResponse.json();

        if (!ghlResponse.ok) {
            throw new Error(data.message || 'GHL API Error');
        }

        console.log('✅ GHL API Success:', data);
        res.json({ success: true, data });

    } catch (error) {
        console.error('❌ API Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve simplified HTML files for clean routes
app.get('/venue', (req, res) => {
    res.sendFile(path.join(__dirname, 'venue.html'));
});

app.get('/details', (req, res) => {
    res.sendFile(path.join(__dirname, 'details.html'));
});

app.get('/activities', (req, res) => {
    res.sendFile(path.join(__dirname, 'activities.html'));
});

app.get('/summary', (req, res) => {
    res.sendFile(path.join(__dirname, 'summary.html'));
});

app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'thank-you.html'));
});

// Redirect root to /venue for now (or keep index.html as landing)
app.get('/', (req, res) => {
    // res.redirect('/venue'); 
    // Keeping existing behavior for root, but maybe user wants /venue to be the start?
    // User said: "we click on start building, then it should take us to the venue page"
    // So index.html (landing) -> /venue
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
