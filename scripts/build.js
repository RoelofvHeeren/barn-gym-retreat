const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');
const DIST_SCRIPTS_DIR = path.join(DIST_DIR, 'scripts');

// Ensure dist/scripts exists
if (!fs.existsSync(DIST_SCRIPTS_DIR)) {
    console.log('Creating dist/scripts directory...');
    fs.mkdirSync(DIST_SCRIPTS_DIR, { recursive: true });
}

// 1. Copy HTML files
// Main entry point
const sourceHtml = path.join(ROOT_DIR, 'full-retreat-booking-embed.html');
const destHtml = path.join(DIST_DIR, 'index.html');
console.log(`Copying ${sourceHtml} to ${destHtml}...`);
fs.copyFileSync(sourceHtml, destHtml);

// Retreat Builder - Keep as standalone fallback
const sourceBuilder = path.join(ROOT_DIR, 'retreat-builder.html');
const destBuilder = path.join(DIST_DIR, 'retreat-builder.html');
console.log(`Copying ${sourceBuilder} to ${destBuilder}...`);
fs.copyFileSync(sourceBuilder, destBuilder);

// Venue Detail Pages - Create Clean URLs
const venues = ['bell', 'oastbrook', 'eastwood'];
const sourceVenueDetail = path.join(ROOT_DIR, 'venue-detail.html');

venues.forEach(venue => {
    const venueDir = path.join(DIST_DIR, venue);
    if (!fs.existsSync(venueDir)) {
        console.log(`Creating directory: ${venueDir}`);
        fs.mkdirSync(venueDir, { recursive: true });
    }
    const destVenueHtml = path.join(venueDir, 'index.html');
    console.log(`Copying venue detail to ${destVenueHtml}...`);

    // Read source HTML
    let venueHtml = fs.readFileSync(sourceVenueDetail, 'utf8');

    // Fix relative paths for subdirectories (prepend ../)
    // Fix CSS
    venueHtml = venueHtml.replace('href="retreat-builder.css"', 'href="../retreat-builder.css"');
    // Fix JS
    venueHtml = venueHtml.replace('src="venue-data.js"', 'src="../venue-data.js"');
    venueHtml = venueHtml.replace('src="venue-detail.js"', 'src="../venue-detail.js"');

    fs.writeFileSync(destVenueHtml, venueHtml);
});

// Also keep venue-detail.html at root for fallback
const destRootVenueDetail = path.join(DIST_DIR, 'venue-detail.html');
fs.copyFileSync(sourceVenueDetail, destRootVenueDetail);

// 2. Copy Root JS/CSS files
const rootFiles = ['venue-data.js', 'venue-detail.js', 'retreat-builder.css'];
rootFiles.forEach(file => {
    const source = path.join(ROOT_DIR, file);
    const dest = path.join(DIST_DIR, file);
    if (fs.existsSync(source)) {
        console.log(`Copying ${source} to ${dest}...`);
        fs.copyFileSync(source, dest);
    }
});

// 3. Copy scripts
const scriptFiles = ['booking-handler.js', 'booking-state.js'];
scriptFiles.forEach(file => {
    const source = path.join(SCRIPTS_DIR, file);
    const dest = path.join(DIST_SCRIPTS_DIR, file);
    if (fs.existsSync(source)) {
        console.log(`Copying ${source} to ${dest}...`);
        fs.copyFileSync(source, dest);
    }
});

console.log('Build complete!');
