require('dotenv').config();

const apiKey = (process.env.GHL_API_KEY || '').trim();
const locationId = (process.env.GHL_LOCATION_ID || 'VYZcxHGdxD0Dj1cj1ZU4').trim();

if (!apiKey) {
    console.error('❌ GHL_API_KEY is missing');
    process.exit(1);
}

async function analyzeFolders() {
    console.log(`🔍 Fetching custom fields to analyze folders for Location ID: ${locationId}`);

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
        const fields = data.customFields;

        const folderCounts = {};
        const folderSamples = {};

        fields.forEach(f => {
            const parentId = f.parentId || 'Uncategorized';
            folderCounts[parentId] = (folderCounts[parentId] || 0) + 1;
            if (!folderSamples[parentId]) {
                folderSamples[parentId] = f.name;
            }
        });

        console.log('--- Folder Analysis ---');
        console.log(JSON.stringify(folderCounts, null, 2));
        console.log('--- Sample Field per Folder ---');
        console.log(JSON.stringify(folderSamples, null, 2));

    } catch (error) {
        console.error('❌ Execution Error:', error.message);
    }
}

analyzeFolders();
