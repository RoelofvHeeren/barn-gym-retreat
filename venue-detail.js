// Venue Detail Page JavaScript
let currentVenue = null;
let currentSlide = 0;
let allImages = [];
let currentLightboxIndex = 0;

// Initialize page on load
document.addEventListener('DOMContentLoaded', function () {
    loadVenueData();
    setupStickyBookingBar();
    setupKeyboardNavigation();
});

// Load venue data from URL parameter
function loadVenueData() {
    const urlParams = new URLSearchParams(window.location.search);
    const venueId = urlParams.get('venue');

    if (!venueId || !venuesDB[venueId]) {
        // Redirect to retreat builder if invalid venue
        window.location.href = 'index.html';
        return;
    }

    currentVenue = venuesDB[venueId];

    // Collect all images for lightbox
    allImages = [
        ...currentVenue.images.hero,
        ...currentVenue.images.accommodation,
        ...currentVenue.images.facilities
    ];

    // Render all sections
    renderHeroSection();
    renderQuickFacts();
    renderAboutSection();
    renderAccommodation();
    renderCorporateFacilities();
    renderAmenities();
    renderRecognition();
    updateBookingBar();

    // Update page title
    document.title = `${currentVenue.name} - Barn Gym Retreat Booking`;
}

// Render Hero Section
function renderHeroSection() {
    const carousel = document.getElementById('heroCarousel');
    const dots = document.getElementById('carouselDots');
    const infoCard = document.getElementById('heroInfoCard');

    // Create slides
    carousel.innerHTML = currentVenue.images.hero.map((img, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}">
            <img src="${img}" alt="${currentVenue.name}" onerror="this.src='https://via.placeholder.com/1200x800?text=Image+Not+Available'">
        </div>
    `).join('');

    // Create dots
    dots.innerHTML = currentVenue.images.hero.map((_, index) => `
        <button class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></button>
    `).join('');

    // Create info card
    infoCard.innerHTML = `
        <h1>${currentVenue.name}</h1>
        <p class="tagline">${currentVenue.tagline}</p>
        <p class="location">📍 ${currentVenue.location.city} • ${currentVenue.location.distanceFromLondon} from London</p>
        <p class="capacity">${currentVenue.capacity.description}</p>
        <p class="pricing">
            From £${currentVenue.pricing.from.toLocaleString()}
            <span>${currentVenue.pricing.unit}</span>
        </p>
        <button class="hero-cta" onclick="requestQuote()">Request Quote</button>
    `;
}

// Carousel Navigation
function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Auto-advance carousel
setInterval(() => {
    changeSlide(1);
}, 5000);

// Render Quick Facts
function renderQuickFacts() {
    const grid = document.getElementById('quickFactsGrid');

    grid.innerHTML = currentVenue.quickFacts.map(fact => `
        <div class="quick-fact">
            <div class="quick-fact-icon">${fact.icon}</div>
            <div class="quick-fact-label">${fact.label}</div>
            <div class="quick-fact-value">${fact.value}</div>
        </div>
    `).join('');
}

// Render About Section
function renderAboutSection() {
    const content = document.getElementById('aboutContent');

    content.innerHTML = `
        <p class="about-description">${currentVenue.about.description}</p>
        <ul class="highlights-list">
            ${currentVenue.about.highlights.map(highlight => `
                <li>${highlight}</li>
            `).join('')}
        </ul>
    `;
}

// Render Accommodation
function renderAccommodation() {
    const overview = document.getElementById('accommodationOverview');
    const categories = document.getElementById('accommodationCategories');

    overview.textContent = currentVenue.accommodation.overview.description;

    categories.innerHTML = currentVenue.accommodation.categories.map((category, index) => `
        <div class="accommodation-card" id="accommodation-${index}">
            <div class="accommodation-header" onclick="toggleAccommodation(${index})">
                <div class="accommodation-title">
                    <h3>${category.name}</h3>
                    <p class="meta">${category.count} ${category.count === 1 ? 'unit' : 'units'} • Sleeps ${category.sleeps}</p>
                </div>
                <span class="expand-icon">▼</span>
            </div>
            <div class="accommodation-content">
                <div class="accommodation-body">
                    <p class="accommodation-description">${category.description}</p>
                    ${category.highlight ? `<p style="color: #2d5016; font-weight: 600; margin-bottom: 15px;">✨ ${category.highlight}</p>` : ''}
                    <ul class="features-list">
                        ${category.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    ${category.rooms ? `
                        <div style="margin-top: 20px;">
                            <h4 style="font-size: 16px; margin-bottom: 10px;">Room Details:</h4>
                            <ul class="features-list">
                                ${category.rooms.map(room => `
                                    <li><strong>${room.name}</strong>${room.type ? ` - ${room.type}` : ''}${room.features ? `: ${room.features}` : ''}${room.highlight ? ` (${room.highlight})` : ''}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function toggleAccommodation(index) {
    const card = document.getElementById(`accommodation-${index}`);
    card.classList.toggle('expanded');
}

// Render Corporate Facilities
function renderCorporateFacilities() {
    const content = document.getElementById('facilitiesContent');

    let html = '';

    // Meeting Spaces
    if (currentVenue.corporateFacilities.meetingSpaces.length > 0) {
        html += '<div style="margin-bottom: 40px;">';
        html += '<h3 style="font-size: 22px; margin-bottom: 20px;">Meeting & Event Spaces</h3>';
        html += '<div style="display: grid; gap: 20px;">';

        currentVenue.corporateFacilities.meetingSpaces.forEach(space => {
            html += `
                <div style="background: #f9f9f9; padding: 24px; border-radius: 12px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 18px;">${space.name}</h4>
                    <p style="color: #666; margin-bottom: 15px;">${space.description}</p>
                    <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                        ${space.capacity.seated ? `<span><strong>Seated:</strong> ${space.capacity.seated}</span>` : ''}
                        ${space.capacity.standing ? `<span><strong>Standing:</strong> ${space.capacity.standing}</span>` : ''}
                    </div>
                    <ul class="features-list">
                        ${space.equipment.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <p style="color: #2d5016; font-weight: 600; margin-top: 10px;">📅 ${space.availability}</p>
                </div>
            `;
        });

        html += '</div></div>';
    }

    // Catering
    html += '<div style="margin-bottom: 40px;">';
    html += '<h3 style="font-size: 22px; margin-bottom: 20px;">Catering Options</h3>';
    html += `<p style="font-size: 16px; color: #555; margin-bottom: 15px;">${currentVenue.corporateFacilities.catering.description}</p>`;
    html += '<ul class="features-list">';
    currentVenue.corporateFacilities.catering.options.forEach(option => {
        html += `<li>${option}</li>`;
    });
    html += '</ul>';
    if (currentVenue.corporateFacilities.catering.chefAvailable) {
        html += '<p style="color: #2d5016; font-weight: 600; margin-top: 15px;">👨‍🍳 Personal chef available</p>';
    }
    html += '</div>';

    // Work Amenities
    html += '<div>';
    html += '<h3 style="font-size: 22px; margin-bottom: 20px;">Work Amenities</h3>';
    html += '<ul class="features-list">';
    currentVenue.corporateFacilities.workAmenities.forEach(amenity => {
        html += `<li>${amenity}</li>`;
    });
    html += '</ul>';
    html += '</div>';

    content.innerHTML = html;
}

// Render Activities
function renderActivities() {
    const grid = document.getElementById('activitiesGrid');

    grid.innerHTML = currentVenue.activities.map(activity => `
        <div class="activity-card">
            <span class="activity-category">${activity.category}</span>
            <h3>${activity.name}</h3>
            <p>${activity.description}</p>
            ${activity.duration ? `<p style="margin-top: 10px; font-size: 13px; color: #888;">⏱️ ${activity.duration}</p>` : ''}
            ${activity.onSite ? '<p style="margin-top: 10px; font-size: 13px; color: #2d5016; font-weight: 600;">📍 Available on-site</p>' : ''}
            ${activity.highlight ? '<div class="activity-highlight">⭐ Popular choice for corporate groups</div>' : ''}
        </div>
    `).join('');
}

// Render Amenities
function renderAmenities() {
    const content = document.getElementById('amenitiesContent');

    content.innerHTML = `
        <div class="facility-category">
            <h3>Leisure Facilities</h3>
            <ul class="facility-list">
                ${currentVenue.facilities.leisure.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="facility-category">
            <h3>Outdoor Spaces</h3>
            <ul class="facility-list">
                ${currentVenue.facilities.outdoor.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="facility-category">
            <h3>Practical Amenities</h3>
            <ul class="facility-list">
                ${currentVenue.facilities.practical.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Render Recognition
function renderRecognition() {
    const grid = document.getElementById('recognitionGrid');

    grid.innerHTML = currentVenue.recognition.map(award => `
        <div class="recognition-badge">
            ⭐ ${award}
        </div>
    `).join('');
}

// Update Booking Bar
function updateBookingBar() {
    document.getElementById('bookingBarTitle').textContent = currentVenue.name;
    document.getElementById('bookingBarPrice').textContent = `From £${currentVenue.pricing.from.toLocaleString()} ${currentVenue.pricing.unit}`;
}

// Setup Sticky Booking Bar
function setupStickyBookingBar() {
    const bookingBar = document.getElementById('stickyBookingBar');
    const heroSection = document.querySelector('.venue-hero');

    window.addEventListener('scroll', () => {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

        if (window.scrollY > heroBottom) {
            bookingBar.classList.add('visible');
        } else {
            bookingBar.classList.remove('visible');
        }
    });
}

// Lightbox Functions
function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    document.getElementById('lightboxOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event && event.target.id !== 'lightboxOverlay' && !event.target.classList.contains('lightbox-close')) {
        return;
    }
    document.getElementById('lightboxOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function lightboxNavigate(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + allImages.length) % allImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = document.getElementById('lightboxImage');
    img.src = allImages[currentLightboxIndex];
}

// Keyboard Navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightboxOverlay');

        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                lightboxNavigate(-1);
            } else if (e.key === 'ArrowRight') {
                lightboxNavigate(1);
            }
        }
    });
}

// Action Functions
function requestQuote() {
    // Store venue selection in localStorage
    localStorage.setItem('selectedVenue', currentVenue.id);

    // Redirect to retreat builder with venue pre-selected
    // In production, index.html is the entry point
    window.location.href = `index.html?venue=${currentVenue.id}`;
}

function contactVenue() {
    // Create mailto link with venue details
    const subject = encodeURIComponent(`Inquiry about ${currentVenue.name}`);
    const body = encodeURIComponent(`Hello,\n\nI'm interested in booking ${currentVenue.name} for a corporate retreat.\n\nPlease provide more information about availability and pricing.\n\nThank you!`);

    if (currentVenue.contact.email) {
        window.location.href = `mailto:${currentVenue.contact.email}?subject=${subject}&body=${body}`;
    } else {
        alert(`Please call ${currentVenue.contact.phone} to inquire about this venue.`);
    }
}
