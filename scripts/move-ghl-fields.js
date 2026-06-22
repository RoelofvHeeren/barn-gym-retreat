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
    'BjInSO18Ys1QzeyKNI3d', // Retreat Venue
    '7ZdXPGKQb8xD3BBOSBgU', // Number of Guests
    'UWQqzLGGk7Uiu5jPhLDO', // Retreat Duration
    'Rwyqk50CKW31aDa7E17C', // Preferred Month
    'RZ2HQrGvVKUMwuidVo4Q', // Retreat Itinerary
    'Nrrw6Ol2eBsf3e95ylNo'  // Estimated Value
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
