import React, { useEffect, useRef } from "react"

const RetreatBookingVariables = `
  :root {
      --font-heading: 'Playfair Display', serif;
      --font-body: 'Raleway', sans-serif;
      --color-primary: #017559;
      --color-primary-dark: #015944;
      --color-text-dark: #2d2d2d;
      --color-text-light: #ffffff;
      --color-card-bg: rgba(255, 255, 255, 0.65);
      --color-card-bg-hover: rgba(255, 255, 255, 0.85);
      --color-border: rgba(255, 255, 255, 0.4);
      --venue-primary: #2d5016;
      --venue-primary-dark: #1e3a0f;
      --venue-text: #333333;
      --venue-text-light: #666666;
      --venue-bg: #ffffff;
      --venue-bg-alt: #f9f9f9;
  }
`

export default function RetreatBookingSystem(props) {
    const containerRef = useRef(null)

    useEffect(() => {
        // Prevent double mounting logic
        if (!containerRef.current) return
        if (containerRef.current.getAttribute("data-loaded")) return
        containerRef.current.setAttribute("data-loaded", "true")

        // --- PASTE YOUR VANILLA JS LOGIC HERE (Adapted) ---

        // Helper: Scope selections to the container
        const $ = (selector) => containerRef.current.querySelector(selector)
        const $$ = (selector) => containerRef.current.querySelectorAll(selector)

        // --- LOGIC START ---

        // State
        let currentStep = 1;
        let selectedVenue = null;
        let guestCount = 12;
        let duration = "3 Days / 2 Nights";
        let selectedActivities = new Set();
        let currentModalVenueId = null;

        // Data (Venues)
        const embedVenuesDB = {
            bell: {
                name: 'The Bell in Ticehurst',
                tagline: 'Quirky 16th Century Coaching Inn',
                capacity: 'Up to 32 guests',
                price: 'From £150 per room',
                description: 'In the quintessentially English village of Ticehurst, discover the storybook charm of The Bell. A creative paradise blending old and new.',
                images: ['https://placehold.co/600x400?text=The+Bell+1', 'https://placehold.co/600x400?text=The+Bell+2'], // UPDATE WITH REAL URLS
                facts: [
                    { icon: 'https://placehold.co/40?text=C', label: 'Capacity', value: '32 Guests' },
                    { icon: 'https://placehold.co/40?text=R', label: 'Rooms', value: '16 Rooms' }
                ],
                accommodation: [
                    { name: 'Hotel Bedrooms', desc: '7 Eccentric rooms over the pub', features: ['Handmade mattresses', 'Copper baths'] }
                ],
                activities: ['Analogue Adventures', 'Wine Masterclass']
            },
            oastbrook: {
                name: 'Oastbrook Estate',
                tagline: 'Luxury Vineyard Retreat',
                capacity: 'Up to 20 guests',
                price: 'From £200 per unit',
                description: 'Set in the heart of Rother Valley, a working vineyard combining rustic charm with modern luxury lodges and glamping.',
                images: ['https://placehold.co/600x400?text=Oastbrook+1', 'https://placehold.co/600x400?text=Oastbrook+2'],
                facts: [
                    { icon: 'https://placehold.co/40?text=C', label: 'Capacity', value: '20 Guests' },
                    { icon: 'https://placehold.co/40?text=D', label: 'Dining', value: 'Vineyard' }
                ],
                accommodation: [
                    { name: 'Vineyard Hollow', desc: 'Earth-sheltered luxury', features: ['Hot tub', 'Valley views'] }
                ],
                activities: ['Vineyard Tours', 'Tasting Room']
            },
            eastwood: {
                name: 'Eastwood Observatory',
                tagline: 'Exclusive 32-Acre Estate',
                capacity: 'Up to 24 guests',
                price: 'From £3500 exclusive use',
                description: 'Idyllic rural setting with unparalleled beauty. Exclusive use of the entire estate, swimming pool, and science center.',
                images: ['https://placehold.co/600x400?text=Eastwood+1', 'https://placehold.co/600x400?text=Eastwood+2'],
                facts: [
                    { icon: 'https://placehold.co/40?text=C', label: 'Capacity', value: '24+ Guests' },
                    { icon: 'https://placehold.co/40?text=E', label: 'Estate', value: '32 Acres' }
                ],
                accommodation: [
                    { name: 'Main House', desc: '13 Bedrooms', features: ['En-suite bathrooms', 'Estate views'] }
                ],
                activities: ['Stargazing', 'Clay Shooting']
            }
        };

        // Functions exposed to window for inline onclicks (or rewritten to event listeners)
        // Since we are in React, we should use event listeners where possible, but for the huge HTML block, 
        // assigning to container scope is easier.

        // Navigation
        window.nextStep = (step) => {
            $$('.step-container').forEach(el => el.classList.remove('active'));
            const target = $(`#step-${step}`);
            if (target) target.classList.add('active');
            currentStep = step;
            if (step === 4) renderSummary();
        };

        window.prevStep = (step) => {
            window.nextStep(step);
        };

        window.handleCardClick = (el, name) => {
            $$('.card-option').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
            selectedVenue = { id: el.id, name: name };
            const nextBtn = $('#btn-loc-next');
            if (nextBtn) nextBtn.disabled = false;
        };

        window.openVenueDetail = (venueId) => {
            const venue = embedVenuesDB[venueId];
            if (!venue) return console.error('Venue not found:', venueId);
            currentModalVenueId = venueId;

            const modalBody = $('#venueModalBody');
            const priceLabel = $('#modalBookingPrice');
            const modal = $('#venueModal');

            if (priceLabel) priceLabel.textContent = venue.price;

            let html = `
                <div class="venue-hero">
                    <img src="${venue.images[0]}" style="width:100%; height:100%; object-fit:cover;">
                    <div class="hero-info-card">
                        <h1>${venue.name}</h1>
                        <p class="tagline">${venue.tagline}</p>
                        <p class="pricing">${venue.price}</p>
                    </div>
                </div>
                <div class="venue-content">
                    <p>${venue.description}</p>
                    <!-- Add more sections here as needed -->
                </div>
            `;

            if (modalBody) modalBody.innerHTML = html;
            if (modal) modal.classList.add('active');
        };

        window.closeVenueModal = () => {
            const modal = $('#venueModal');
            if (modal) modal.classList.remove('active');
        };

        window.selectVenueAndClose = () => {
            // Logic to select venue
            window.closeVenueModal();
        };

        // Update Details
        window.updateDetails = () => {
            const guestInput = $('#guest-count');
            if (guestInput) guestCount = guestInput.value;
            // update UI...
        };

        // --- END LOGIC ---

    }, [])

    return (
        <div ref={containerRef} className="retreat-booking-wrapper">
            <style>{RetreatBookingVariables}</style>
            <style>{`
                /* PASTE YOUR FULL CSS HERE */
                .retreat-booking-wrapper {
                    font-family: 'Raleway', sans-serif;
                    color: #2d2d2d;
                    width: 100%;
                    height: 100%;
                }
                .barn-glass-card {
                    background: rgba(255, 255, 255, 0.65);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 40px;
                    max-width: 900px;
                    width: 100%;
                    margin: 0 auto;
                }
                /* ... rest of CSS ... */
                .step-container { display: none; }
                .step-container.active { display: block; }
                
                 /* Modal Styles */
                .venue-modal-overlay {
                    display: none;
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); z-index: 9999999;
                }
                .venue-modal-overlay.active { display: flex; justify-content: center; align-items: center; }
                .venue-modal-content { background: white; padding: 20px; border-radius: 12px; max-width: 800px; width: 90%; position: relative; z-index: 10000000; }
             `}</style>

            <div className="barn-glass-card">
                {/* STEP 1 */}
                <div id="step-1" className="step-container active">
                    <h1>Design Your Custom<br />Corporate Retreats</h1>
                    <button onClick={() => window.nextStep(2)}>Start Building</button>
                </div>

                {/* STEP 2 */}
                <div id="step-2" className="step-container">
                    <h2>Select Venue</h2>
                    <div className="card-option" id="card-bell" onClick={(e) => window.handleCardClick(e.currentTarget, 'The Bell')}>
                        <h3>The Bell</h3>
                        <button onClick={(e) => { e.stopPropagation(); window.openVenueDetail('bell'); }}>Learn More</button>
                    </div>
                    {/* ... other cards ... */}
                    <button onClick={() => window.prevStep(1)}>Back</button>
                    <button id="btn-loc-next" disabled onClick={() => window.nextStep(3)}>Next</button>
                </div>

                {/* STEP 3... */}

                {/* MODAL */}
                <div id="venueModal" className="venue-modal-overlay">
                    <div className="venue-modal-content">
                        <button onClick={() => window.closeVenueModal()}>Close</button>
                        <div id="venueModalBody"></div>
                        <button onClick={() => window.selectVenueAndClose()}>Select</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
