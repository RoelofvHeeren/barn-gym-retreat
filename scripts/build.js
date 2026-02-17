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

// Copy new MPA pages
const mpaPages = ['venue.html', 'details.html', 'activities.html', 'summary.html', 'thank-you.html'];
mpaPages.forEach(page => {
    const src = path.join(ROOT_DIR, page);
    const dest = path.join(DIST_DIR, page);
    if (fs.existsSync(src)) {
        console.log(`Copying ${src} to ${dest}...`);
        fs.copyFileSync(src, dest);
    }
});

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

// 4. Copy Retreat Images (Recursive)
const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

const sourceImages = path.join(ROOT_DIR, 'Retreat Images');
const destImages = path.join(DIST_DIR, 'Retreat Images');
if (fs.existsSync(sourceImages)) {
    console.log(`Copying Retreat Images to ${destImages}...`);
    copyRecursiveSync(sourceImages, destImages);
}

console.log('Build complete!');
