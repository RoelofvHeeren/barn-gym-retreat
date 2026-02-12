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

// 1. Copy HTML
const sourceHtml = path.join(ROOT_DIR, 'full-retreat-booking-embed.html');
const destHtml = path.join(DIST_DIR, 'index.html');

console.log(`Copying ${sourceHtml} to ${destHtml}...`);
fs.copyFileSync(sourceHtml, destHtml);

// 2. Copy Booking Handler Script
const sourceScript = path.join(SCRIPTS_DIR, 'booking-handler.js');
const destScript = path.join(DIST_SCRIPTS_DIR, 'booking-handler.js');

if (fs.existsSync(sourceScript)) {
    console.log(`Copying ${sourceScript} to ${destScript}...`);
    fs.copyFileSync(sourceScript, destScript);
} else {
    console.warn(`Warning: ${sourceScript} not found!`);
}

console.log('Build sync complete!');
