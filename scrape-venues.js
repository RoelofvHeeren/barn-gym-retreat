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

const OUTPUT_DIR = path.join(__dirname, 'scraped-venues');

// Helper function to fetch URL via HTTP
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Helper function to extract images from HTML
function extractImages(html, baseUrl) {
    const images = [];
    const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);

    for (const match of imgMatches) {
        let imgUrl = match[1];

        // Skip data URLs, placeholders, and icons
        if (imgUrl.startsWith('data:') ||
            imgUrl.includes('placeholder') ||
            imgUrl.includes('icon') ||
            imgUrl.includes('logo') ||
            imgUrl.endsWith('.svg')) {
            continue;
        }

        // Convert relative URLs to absolute
        if (imgUrl.startsWith('//')) {
            imgUrl = 'https:' + imgUrl;
        } else if (imgUrl.startsWith('/')) {
            const base = new URL(baseUrl);
            imgUrl = base.origin + imgUrl;
        } else if (!imgUrl.startsWith('http')) {
            try {
                imgUrl = new URL(imgUrl, baseUrl).href;
            } catch (e) {
                continue;
            }
        }

        images.push(imgUrl);
    }

    return [...new Set(images)]; // Remove duplicates
}

// Helper function to extract text content
function extractTextContent(html) {
    // Remove script and style tags
    let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Extract headings
    const headings = [];
    const h1Matches = text.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi);
    const h2Matches = text.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi);
    const h3Matches = text.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi);

    for (const match of h1Matches) {
        const cleanText = match[1].replace(/<[^>]+>/g, '').trim();
        if (cleanText) headings.push({ level: 1, text: cleanText });
    }
    for (const match of h2Matches) {
        const cleanText = match[1].replace(/<[^>]+>/g, '').trim();
        if (cleanText) headings.push({ level: 2, text: cleanText });
    }
    for (const match of h3Matches) {
        const cleanText = match[1].replace(/<[^>]+>/g, '').trim();
        if (cleanText) headings.push({ level: 3, text: cleanText });
    }

    // Extract paragraphs
    const paragraphs = [];
    const pMatches = text.matchAll(/<p[^>]*>(.*?)<\/p>/gi);
    for (const match of pMatches) {
        const cleanText = match[1].replace(/<[^>]+>/g, '').trim();
        if (cleanText.length > 20) { // Only meaningful paragraphs
            paragraphs.push(cleanText);
        }
    }

    // Extract list items
    const listItems = [];
    const liMatches = text.matchAll(/<li[^>]*>(.*?)<\/li>/gi);
    for (const match of liMatches) {
        const cleanText = match[1].replace(/<[^>]+>/g, '').trim();
        if (cleanText.length > 5) {
            listItems.push(cleanText);
        }
    }

    return { headings, paragraphs, listItems };
}

async function scrapeVenue(browser, venue) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Scraping: ${venue.name}`);
    console.log(`${'='.repeat(60)}\n`);

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });
    const page = await context.newPage();

    const venueData = {
        name: venue.name,
        id: venue.id,
        baseUrl: venue.baseUrl,
        scrapedAt: new Date().toISOString(),
        pages: []
    };

    try {
        // Scrape each direct URL
        for (let i = 0; i < venue.directUrls.length; i++) {
            const url = venue.directUrls[i];
            console.log(`[${i + 1}/${venue.directUrls.length}] Scraping: ${url}`);

            try {
                await page.goto(url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 15000
                });
                await page.waitForTimeout(2000); // Let any dynamic content load

                const html = await page.content();
                const title = await page.title();

                const pageData = {
                    url,
                    title,
                    content: extractTextContent(html),
                    images: extractImages(html, url)
                };

                venueData.pages.push(pageData);
                console.log(`  ✓ Extracted ${pageData.images.length} images, ${pageData.content.headings.length} headings, ${pageData.content.paragraphs.length} paragraphs`);

            } catch (error) {
                console.log(`  ✗ Error scraping ${url}: ${error.message}`);
            }
        }

    } catch (error) {
        console.error(`Error scraping ${venue.name}: ${error.message}`);
    } finally {
        await context.close();
    }

    return venueData;
}

async function main() {
    console.log('\n🚀 Starting Venue Scraper (Improved Version)\n');

    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Launch browser
    const browser = await chromium.launch({ headless: true });

    try {
        // Scrape all venues
        for (const venue of VENUES) {
            const venueData = await scrapeVenue(browser, venue);

            // Save to JSON file
            const outputFile = path.join(OUTPUT_DIR, `${venue.id}.json`);
            await fs.writeFile(outputFile, JSON.stringify(venueData, null, 2));
            console.log(`\n💾 Saved data to: ${outputFile}`);

            // Create a summary file
            const summaryFile = path.join(OUTPUT_DIR, `${venue.id}-summary.txt`);
            let summary = `${venue.name} - Scrape Summary\n`;
            summary += `${'='.repeat(60)}\n\n`;
            summary += `Total Pages Scraped: ${venueData.pages.length}\n`;
            summary += `Total Images Found: ${venueData.pages.reduce((sum, p) => sum + p.images.length, 0)}\n`;
            summary += `Total Headings: ${venueData.pages.reduce((sum, p) => sum + p.content.headings.length, 0)}\n`;
            summary += `Total Paragraphs: ${venueData.pages.reduce((sum, p) => sum + p.content.paragraphs.length, 0)}\n\n`;
            summary += `Pages:\n`;
            venueData.pages.forEach((page, i) => {
                summary += `\n${i + 1}. ${page.title}\n`;
                summary += `   URL: ${page.url}\n`;
                summary += `   Images: ${page.images.length}\n`;
                summary += `   Headings: ${page.content.headings.length}\n`;
                summary += `   Paragraphs: ${page.content.paragraphs.length}\n`;
            });

            await fs.writeFile(summaryFile, summary);
            console.log(`📄 Saved summary to: ${summaryFile}\n`);
        }

        console.log('\n✅ Scraping complete!\n');
        console.log(`📁 All data saved to: ${OUTPUT_DIR}\n`);

    } finally {
        await browser.close();
    }
}

// Run the scraper
main().catch(console.error);

