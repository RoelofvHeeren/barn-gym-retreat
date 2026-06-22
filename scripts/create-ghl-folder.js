require('dotenv').config();

const apiKey = (process.env.GHL_API_KEY || '').trim();
const locationId = (process.env.GHL_LOCATION_ID || '').trim();

if (!apiKey || !locationId) {
    console.error('❌ GHL_API_KEY or GHL_LOCATION_ID is missing');
    process.exit(1);
}

async function createFolder() {
    console.log(`🛠️ Creating 'Corporate Retreats' folder for Location ID: ${locationId}`);

    try {
        const response = await fetch(`https://services.leadconnectorhq.com/custom-fields/folder`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Corporate Retreats',
                locationId: locationId,
                objectKey: 'contact'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Failed to create folder:', response.status, JSON.stringify(error, null, 2));
        } else {
            const data = await response.json();
            console.log(`✅ Created Folder 'Corporate Retreats' (ID: ${data.id})`);
        }

    } catch (error) {
        console.error('❌ Error creating folder:', error.message);
    }
}

createFolder();
