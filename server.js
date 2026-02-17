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
    const apiKey = (process.env.GHL_API_KEY || '').trim();
    const locationId = (process.env.GHL_LOCATION_ID || 'VYZcxHGdxD0Dj1cj1ZU4').trim();

    if (!apiKey) {
        console.error('❌ GHL_API_KEY is missing in environment variables');
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    console.log(`🔑 Using GHL API Key: ${apiKey.substring(0, 4)}...${apiKey.slice(-4)}`);
    console.log(`HMAC: Using Location ID: ${locationId}`);

    try {
        const formData = req.body;
        console.log('📩 Received booking request for:', formData.companyName);

        const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify({
                locationId: locationId,
                name: formData.contactName,
                email: formData.contactEmail,
                phone: formData.contactPhone,
                companyName: formData.companyName,
                tags: ['retreat-inquiry'],
                customFields: [
                    { key: 'drAttb54oE9hYTKTz5sl', value: formData.venueName }, // Retreat Venue
                    { key: 'Y4U3UcWXvy15n7xQiRR1', value: formData.guestCount }, // Number of Guests
                    { key: 'qGZC8Mu4EKPt7uv1TrKC', value: formData.duration }, // Retreat Duration
                    { key: 'NpnWGV4VIYF44wzNmB4F', value: formData.month }, // Preferred Month
                    { key: 'RZp139wBFsAaJ6ftQ6Tz', value: formData.itineraryText }, // Retreat Itinerary
                    { key: 'QXRLWvPeNZKgUAFYbaP8', value: formData.opportunityValue } // Estimated Value
                ]
            })
        });

        const data = await ghlResponse.json();

        if (!ghlResponse.ok) {
            console.error('❌ GHL API Error Status:', ghlResponse.status);
            console.error('❌ GHL API Error Response:', JSON.stringify(data, null, 2));
            throw new Error(data.message || data.error || 'GHL API Error');
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
