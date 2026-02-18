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
        console.log('📩 Received booking request:', JSON.stringify(formData, null, 2));

        const customFields = [
            { key: 'drAttb54oE9hYTKTz5sl', value: formData.venueName }, // Retreat Venue
            { key: 'Y4U3UcWXvy15n7xQiRR1', value: formData.guestCount }, // Number of Guests
            { key: 'qGZC8Mu4EKPt7uv1TrKC', value: formData.duration }, // Retreat Duration
            { key: 'NpnWGV4VIYF44wzNmB4F', value: formData.month }, // Preferred Month
            { key: 'RZp139wBFsAaJ6ftQ6Tz', value: formData.itineraryText }, // Retreat Itinerary
            { key: 'QXRLWvPeNZKgUAFYbaP8', value: formData.opportunityValue } // Estimated Value
        ];

        console.log('📦 Sending Custom Fields to GHL:', JSON.stringify(customFields, null, 2));


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
                tags: ['retreat-inquiry']
            })
        });

        const data = await ghlResponse.json();

        if (!ghlResponse.ok) {
            console.error('❌ GHL API Error Status:', ghlResponse.status);
            console.error('❌ GHL API Error Response:', JSON.stringify(data, null, 2));
            throw new Error(data.message || data.error || 'GHL API Error');
        }

        console.log('✅ GHL Contact Created:', data);

        // ---------------------------------------------------------
        // Create Opportunity in GHL
        // ---------------------------------------------------------
        try {
            const contactId = data.contact?.id || data.id; // Adjust based on actual GHL response structure
            if (contactId) {
                const pipelineId = '9iysVOLCI7MkI8fvhpzO'; // Corporate Retreats Pipeline
                const stageId = '2c9461d3-3e66-4401-bd9a-9b7fee58a74e'; // New Lead Stage

                // Ensure monetary value is a number
                const monetaryValue = parseFloat(formData.opportunityValue) || 0;

                const opportunityPayload = {
                    pipelineId: pipelineId,
                    locationId: locationId,
                    name: formData.opportunity_name || `${formData.companyName} x ${formData.venueName}`,
                    pipelineStageId: stageId,
                    status: 'open',
                    contactId: contactId,
                    monetaryValue: monetaryValue,
                    customFields: customFields // Moved from Contact to Opportunity
                };

                console.log('💼 Creating Opportunity in GHL:', JSON.stringify(opportunityPayload, null, 2));

                const oppResponse = await fetch('https://services.leadconnectorhq.com/opportunities/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'Version': '2021-07-28'
                    },
                    body: JSON.stringify(opportunityPayload)
                });

                const oppData = await oppResponse.json();

                if (!oppResponse.ok) {
                    console.error('❌ GHL Opportunity Creation Failed:', JSON.stringify(oppData, null, 2));
                    // We don't throw here to avoid failing the whole request if just the opp fails
                } else {
                    console.log('✅ GHL Opportunity Created:', oppData);
                }
            } else {
                console.warn('⚠️ Could not create opportunity: Contact ID not found in response');
            }
        } catch (oppError) {
            console.error('❌ Error creating opportunity:', oppError.message);
        }

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

// Serve the embed file explicitly
app.get('/full-retreat-booking-embed.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'full-retreat-booking-embed.html'));
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
