require('dotenv').config();

const apiKey = (process.env.GHL_API_KEY || '').trim();
const locationId = (process.env.GHL_LOCATION_ID || 'VYZcxHGdxD0Dj1cj1ZU4').trim();
const folderId = 'UZmwpO2kGuqlSBzBzOEt'; // Inferred Corporate Retreats folder ID based on analysis

if (!apiKey) {
    console.error('❌ GHL_API_KEY is missing');
    process.exit(1);
}

// IDs of fields to move
const fieldsToMove = [
    'drAttb54oE9hYTKTz5sl', // Retreat Venue
    'Y4U3UcWXvy15n7xQiRR1', // Number of Guests
    'qGZC8Mu4EKPt7uv1TrKC', // Retreat Duration
    'NpnWGV4VIYF44wzNmB4F', // Preferred Month
    'RZp139wBFsAaJ6ftQ6Tz', // Retreat Itinerary
    'QXRLWvPeNZKgUAFYbaP8'  // Estimated Value
];

async function moveFields() {
    console.log(`🚚 Moving fields to folder ${folderId}...`);

    for (const fieldId of fieldsToMove) {
        try {
            const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}/customFields/${fieldId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Version': '2021-07-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parentId: folderId
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error(`❌ Failed to move field ${fieldId}:`, response.status, JSON.stringify(error, null, 2));
            } else {
                console.log(`✅ Moved field ${fieldId} to folder.`);
            }

        } catch (error) {
            console.error(`❌ Error moving field ${fieldId}:`, error.message);
        }
    }
    console.log('🏁 Move operation complete.');
}

moveFields();
