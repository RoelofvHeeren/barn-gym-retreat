require('dotenv').config();

const apiKey = (process.env.GHL_API_KEY || '').trim();
const locationId = (process.env.GHL_LOCATION_ID || 'VYZcxHGdxD0Dj1cj1ZU4').trim();

if (!apiKey) {
    console.error('❌ GHL_API_KEY is missing');
    process.exit(1);
}

async function fetchCustomFields() {
    console.log(`🔍 Fetching custom fields for Location ID: ${locationId}`);

    try {
        const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}/customFields`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Version': '2021-07-28',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Error fetching fields:', response.status, JSON.stringify(error, null, 2));
            return;
        }

        const data = await response.json();
        console.log('✅ Custom Fields Retrieved:');
        console.log(JSON.stringify(data, null, 2));

        // Filter for relevant fields
        const relevantKeys = ['corporate_venue', 'number_of_guests', 'retreat_duration', 'preferred_month', 'retreat_itinerary', 'estimated_value', 'retreat_venue', 'amount_of_guest'];

        console.log('\n--- Relevant Fields Found ---');
        const found = data.customFields.filter(f => relevantKeys.some(k => f.name.toLowerCase().includes(k.replace('_', ' ')) || f.fieldKey.includes(k)));
        found.forEach(f => {
            console.log(`Name: ${f.name} | Key: ${f.fieldKey} | ID: ${f.id}`);
        });

    } catch (error) {
        console.error('❌ Execution Error:', error.message);
    }
}

fetchCustomFields();
