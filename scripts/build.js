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
const htmlFiles = [
    { src: 'full-retreat-booking-embed.html', dest: 'index.html' },
    { src: 'retreat-builder.html', dest: 'retreat-builder.html' },
    { src: 'venue-detail.html', dest: 'venue-detail.html' }
];

htmlFiles.forEach(file => {
    const source = path.join(ROOT_DIR, file.src);
    const dest = path.join(DIST_DIR, file.dest);
    console.log(`Copying ${source} to ${dest}...`);
    fs.copyFileSync(source, dest);
});

// 2. Copy Root JS files
const rootJsFiles = ['venue-data.js', 'venue-detail.js'];
rootJsFiles.forEach(file => {
    const source = path.join(ROOT_DIR, file);
    const dest = path.join(DIST_DIR, file);
    if (fs.existsSync(source)) {
        console.log(`Copying ${source} to ${dest}...`);
        fs.copyFileSync(source, dest);
    }
});

// 3. Copy scripts/booking-handler.js
const sourceScript = path.join(SCRIPTS_DIR, 'booking-handler.js');
const destScript = path.join(DIST_SCRIPTS_DIR, 'booking-handler.js');

if (fs.existsSync(sourceScript)) {
    console.log(`Copying ${sourceScript} to ${destScript}...`);
    fs.copyFileSync(sourceScript, destScript);
}

console.log('Build complete!');
