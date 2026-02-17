require('dotenv').config();

const apiKey = (process.env.GHL_API_KEY || '').trim();
const locationId = (process.env.GHL_LOCATION_ID || 'VYZcxHGdxD0Dj1cj1ZU4').trim();

if (!apiKey) {
    console.error('❌ GHL_API_KEY is missing');
    process.exit(1);
}

const fieldsToCreate = [
    { name: 'Retreat Venue', dataType: 'TEXT' },
    { name: 'Number of Guests', dataType: 'NUMERICAL' },
    { name: 'Retreat Duration', dataType: 'TEXT' },
    { name: 'Preferred Month', dataType: 'TEXT' },
    { name: 'Retreat Itinerary', dataType: 'LARGE_TEXT' },
    { name: 'Estimated Value', dataType: 'MONETORY' } // Note: Check 'MONETARY' spelling in GHL API docs, usually 'MONETORY' in some versions or 'NUMERICAL' with format. Let's use TEXT to be safe if unsure, or MONETORY if standard. The fetch output showed 'MONETORY' for 'Healthcare Cost'.
];

async function createCustomFields() {
    console.log(`🛠️ Creating custom fields for Location ID: ${locationId}`);

    for (const field of fieldsToCreate) {
        try {
            console.log(`Creating ${field.name}...`);
            const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}/customFields`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Version': '2021-07-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: field.name,
                    dataType: field.dataType,
                    model: 'contact'
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error(`❌ Failed to create ${field.name}:`, response.status, JSON.stringify(error, null, 2));
            } else {
                const data = await response.json();
                console.log(`✅ Created ${field.name} (ID: ${data.id})`);
            }

        } catch (error) {
            console.error(`❌ Error creating ${field.name}:`, error.message);
        }
    }
}

createCustomFields();
