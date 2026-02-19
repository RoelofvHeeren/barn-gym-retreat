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

        // ---------------------------------------------------------
        // 1. Check if contact exists
        // ---------------------------------------------------------
        let contactId = null;
        let contactData = null;

        // Try to find by email first
        if (formData.contactEmail) {
            try {
                const lookupUrl = `https://services.leadconnectorhq.com/contacts/lookup?email=${encodeURIComponent(formData.contactEmail)}`;
                const lookupRes = await fetch(lookupUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Version': '2021-07-28'
                    }
                });

                if (lookupRes.ok) {
                    const lookupData = await lookupRes.json();
                    if (lookupData.contacts && lookupData.contacts.length > 0) {
                        contactId = lookupData.contacts[0].id;
                        console.log(`🔍 Found existing contact: ${contactId}`);
                    }
                }
            } catch (err) {
                console.warn('⚠️ Contact lookup failed:', err.message);
            }
        }

        // ---------------------------------------------------------
        // 2. Create or Update Contact
        // ---------------------------------------------------------
        const contactPayload = {
            locationId: locationId,
            name: formData.contactName,
            email: formData.contactEmail,
            phone: formData.contactPhone,
            companyName: formData.companyName,
            tags: ['retreat-inquiry'],
            customFields: customFields // Updating custom fields on contact too
        };

        let ghlResponse;

        if (contactId) {
            // UPDATE existing contact
            console.log(`Vm Updating existing contact ${contactId}...`);
            ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify(contactPayload)
            });
        } else {
            // CREATE new contact
            console.log('✨ Creating new contact...');
            ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify(contactPayload)
            });
        }

        const data = await ghlResponse.json();

        if (!ghlResponse.ok) {
            console.error('❌ GHL Contact API Error:', ghlResponse.status, JSON.stringify(data, null, 2));
            throw new Error(data.message || 'Failed to sync contact with GHL');
        }

        contactId = data.contact?.id || data.id || contactId;
        console.log('✅ Contact synced successfully:', contactId);

        // ---------------------------------------------------------
        // 3. Create Opportunity in GHL
        // ---------------------------------------------------------
        try {
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
                    customFields: customFields
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
                console.warn('⚠️ Could not create opportunity: Contact ID missing');
            }
        } catch (oppError) {
            console.error('❌ Error creating opportunity:', oppError.message);
        }

        res.json({ success: true, contactId });

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
