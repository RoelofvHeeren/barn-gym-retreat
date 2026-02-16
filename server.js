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
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                companyName: formData.companyName,
                tags: formData.tags,
                customFields: [
                    // We need to map friendly names to IDs if using Custom Fields in GHL.
                    // For now, we'll pass what we can or rely on the user to provide mappings.
                    // Or we just send the standard fields.
                    { key: 'corporate_venue', value: formData.customData.corporate_venue },
                    { key: 'number_of_guests', value: formData.customData.number_of_guests },
                    // ... other fields need their specific GHL Field IDs usually.
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

// Fallback to index.html for SPA-like routing (if needed) or just serving static
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
