require('dotenv').config();

const apiKey = (process.env.GHL_API_KEY || '').trim();
const locationId = (process.env.GHL_LOCATION_ID || 'VYZcxHGdxD0Dj1cj1ZU4').trim();

if (!apiKey) {
    console.error('❌ GHL_API_KEY is missing');
    process.exit(1);
}

async function fetchGroups() {
    console.log(`🔍 Fetching custom field groups for Location ID: ${locationId}`);

    try {
        const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}/customFields/folders?model=contact`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Version': '2021-07-28',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Error fetching groups:', response.status, JSON.stringify(error, null, 2));
            return;
        }

        const data = await response.json();
        console.log('✅ Custom Field Groups/Folders Retrieved:');
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('❌ Execution Error:', error.message);
    }
}

fetchGroups();
