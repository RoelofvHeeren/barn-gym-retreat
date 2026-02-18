
// Native fetch is available in Node 18+

async function testBooking() {
    try {
        const response = await fetch('http://localhost:3000/api/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contactName: `Test User ${Date.now()}`,
                contactEmail: `test-${Date.now()}@example.com`,
                contactPhone: `+1${Math.floor(Math.random() * 10000000000)}`,
                companyName: 'TestCorp',
                venueName: 'The Bell',
                guestCount: 12,
                duration: 3,
                month: 'October',
                itineraryText: 'Relaxation and team building',
                opportunityValue: 9000
            })
        });

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testBooking();
