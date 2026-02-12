const fs = require('fs');

const html = fs.readFileSync('full-retreat-booking-embed.html', 'utf8');
const lines = html.split('\n');

let depth = 0;
let cardDepth = -1;
let step5Depth = -1;
let step5Line = -1;

console.log('--- HTML Structure Analysis ---');

lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Count opening divs
    const openings = (line.match(/<div/g) || []).length;
    // Count closing divs
    const closings = (line.match(/<\/div>/g) || []).length;

    // Adjust depth based on line
    // We assume <div ...> and </div> might be on same line or different. 
    // This is a naive parser but should work for this formatted file.

    // Check for key elements before depth change
    if (line.includes('class="barn-glass-card')) {
        console.log(`[Line ${index + 1}] Found .barn-glass-card at depth ${depth}`);
        cardDepth = depth;
    }

    if (line.includes('id="step-5"')) {
        console.log(`[Line ${index + 1}] Found #step-5 at depth ${depth}`);
        step5Depth = depth;
        step5Line = index + 1;

        if (cardDepth !== -1 && depth <= cardDepth) {
            console.error(`ERROR: step-5 is NOT inside barn-glass-card! (Step5 Depth: ${depth}, Card Depth: ${cardDepth})`);
        } else if (cardDepth !== -1) {
            console.log(`OK: step-5 is inside barn-glass-card.`);
        } else {
            console.log(`WARNING: barn-glass-card not found yet?`);
        }
    }

    if (line.includes('id="activity-modal"')) {
        console.log(`[Line ${index + 1}] Found #activity-modal at depth ${depth}`);
    }

    depth += openings;
    depth -= closings;

    if (openings > 0 || closings > 0) {
        // console.log(`[Line ${index+1}] Depth: ${depth} (+${openings} -${closings})`);
    }

    if (cardDepth !== -1 && depth <= cardDepth && closings > 0) {
        console.log(`[Line ${index + 1}] .barn-glass-card closed here! (Depth returned to ${depth})`);
        cardDepth = -1; // Closed
    }
});

console.log(`Final Depth: ${depth}`);
