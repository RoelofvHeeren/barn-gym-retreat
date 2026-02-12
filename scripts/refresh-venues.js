const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const VENUES = [
    {
        name: 'The Bell Inn',
        id: 'bell',
        folderName: 'The Bell',
        baseUrl: 'https://www.thebellinticehurst.com',
        directUrls: [
            'https://www.thebellinticehurst.com/rooms/',
            'https://www.thebellinticehurst.com/events/',
            'https://www.thebellinticehurst.com/meetings/',
            'https://www.thebellinticehurst.com/gallery/'
        ]
    },
    {
        name: 'Oastbrook Vineyard',
        id: 'oastbrook',
        folderName: 'Oastbrook',
        baseUrl: 'https://oastbrook.com',
        directUrls: [
            'https://oastbrook.com/accommodation/vineyard-hollow/',
            'https://oastbrook.com/accommodation/avalon-waterside-lodge/',
            'https://oastbrook.com/luxury-sussex-glamping/',
            'https://oastbrook.com/corporate-events/',
            'https://oastbrook.com/accommodation/'
        ]
    },
    {
        name: 'Eastwood Observatory',
        id: 'eastwood',
        folderName: 'Eastwood',
        baseUrl: 'https://www.eastwoodobservatory.co.uk',
        directUrls: [
            'https://www.eastwoodobservatory.co.uk/bedrooms/',
            'https://www.eastwoodobservatory.co.uk/corporate/',
            'https://www.eastwoodobservatory.co.uk/activities/',
            'https://www.eastwoodobservatory.co.uk/facilities/',
            'https://www.eastwoodobservatory.co.uk/gallery/'
        ]
    }
];

const IMAGES_DIR = path.join(__dirname, '../Retreat Images');
const HTML_FILE = path.join(__dirname, '../full-retreat-booking-embed.html');

// Helper to sanitize filename
function sanitizeFilename(url) {
    const parsed = new URL(url);
    const basename = path.basename(parsed.pathname);
    return basename.replace(/[^a-z0-9.]/gi, '_');
}

// Download image
async function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Status ${res.statusCode}`));
            }
            const fileStream = require('fs').createWriteStream(destPath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function scrapeImages(browser, venue) {
    console.log(`\n📷 Scraping images for: ${venue.name}`);
    const venueDir = path.join(IMAGES_DIR, venue.folderName);
    await fs.mkdir(venueDir, { recursive: true });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });
    const page = await context.newPage();
    const downloadedImages = new Set();

    // First, catalogue existing files
    try {
        const existingFiles = await fs.readdir(venueDir);
        existingFiles.forEach(f => downloadedImages.add(f));
    } catch (e) {
        // Directory might not exist yet
    }

    try {
        for (const url of venue.directUrls) {
            console.log(`   Visiting: ${url}`);
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await page.waitForTimeout(2000); // Wait for lazy loading

                // Extract image URLs
                const imgUrls = await page.evaluate(() => {
                    const images = Array.from(document.images);
                    return images
                        .map(img => img.src)
                        .filter(src => !src.startsWith('data:') && !src.includes('placeholder') && !src.includes('icon') && !src.endsWith('.svg'));
                });

                // Download unique images
                for (const imgUrl of imgUrls) {
                    const filename = sanitizeFilename(imgUrl);
                    if (!filename || filename.length < 5) continue;

                    const filePath = path.join(venueDir, filename);

                    if (!downloadedImages.has(filename)) {
                        try {
                            await downloadImage(imgUrl, filePath);
                            downloadedImages.add(filename);
                            process.stdout.write('.');
                        } catch (e) {
                            // Ignore download errors
                        }
                    }
                }
            } catch (e) {
                console.log(`   Error visiting ${url}: ${e.message}`);
            }
        }
    } finally {
        await context.close();
    }
    console.log(`\n   ✅ Total images: ${downloadedImages.size}`);
}

async function updateHtmlGallery() {
    console.log('\n📝 Updating HTML Gallery...');

    let htmlContent = await fs.readFile(HTML_FILE, 'utf8');

    for (const venue of VENUES) {
        const venueDir = path.join(IMAGES_DIR, venue.folderName);
        try {
            const files = await fs.readdir(venueDir);
            const imagePaths = files
                .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
                .map(f => `Retreat Images/${venue.folderName}/${f}`);

            if (imagePaths.length > 0) {
                console.log(`   Updating ${venue.name}: ${imagePaths.length} images sourced locally.`);

                // Regex to find the images array in the specific venue object
                // Looking for: venuesDB -> venue key -> images: [...]
                // This is a bit tricky with regex, so we'll look for the specific block structure

                const venueBlockRegex = new RegExp(`(${venue.id}:\\s*{[\\s\\S]*?images:\\s*\\[)([\\s\\S]*?)(\\])`, 'g');

                // Construct new images array string
                const newImagesArray = '\n' + imagePaths.map(p => `                    '${p}'`).join(',\n') + '\n                ';

                htmlContent = htmlContent.replace(venueBlockRegex, (match, prefix, oldContent, suffix) => {
                    return prefix + newImagesArray + suffix;
                });
            }
        } catch (e) {
            console.log(`   Skipping ${venue.name} (folder not found or empty)`);
        }
    }

    await fs.writeFile(HTML_FILE, htmlContent, 'utf8');
    console.log('✅ HTML updated successfully!');
}

async function main() {
    console.log('🚀 Starting Venue Refresh...');

    // 1. Scrape and Download Images
    // Check if --skip-scrape flag is passed
    if (!process.argv.includes('--skip-scrape')) {
        const browser = await chromium.launch({ headless: true });
        try {
            for (const venue of VENUES) {
                await scrapeImages(browser, venue);
            }
        } finally {
            await browser.close();
        }
    } else {
        console.log('⏩ Skipping scrape, updating HTML only...');
    }

    // 2. Update HTML with local files
    await updateHtmlGallery();

    console.log('\n🎉 Done! You can now review the "Retreat Images" folder and delete unwanted images.');
    console.log('   Run "npm run refresh-gallery -- --skip-scrape" to update the gallery after deleting files.');
}

main().catch(console.error);
