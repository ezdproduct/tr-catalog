
import fs from 'fs';

const content = fs.readFileSync('./supabase.txt', 'utf8');
// Find anything between double quotes that has a media extension
const regex = /"[^"]+\.(?:jpg|jpeg|png|webp|svg|gif|mp4|webm|avif)[^"]*"/gi;
const matches = content.match(regex) || [];

const uniqueAssets = new Set(matches.map(m => m.replace(/"/g, '')));

console.log('Total matches found:', matches.length);
console.log('Unique assets found:', uniqueAssets.size);

// Check if any of these are missing a protocol
const relative = Array.from(uniqueAssets).filter(u => !u.includes('//') && !u.startsWith('http') && !u.startsWith('/'));
console.log('Relative paths found:', relative.length);
if (relative.length > 0) console.log('Sample relative:', relative.slice(0, 5));
