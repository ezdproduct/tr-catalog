
import fs from 'fs';

const content = fs.readFileSync('./supabase.txt', 'utf8');
const regex = /"(?:http|https:|\/\/|\/)[^"]+\.(?:jpg|jpeg|png|webp|svg|gif|mp4|webm|avif)[^"]*"/gi;
const matches = content.match(regex) || [];

const uniqueAssets = new Set(matches.map(m => m.replace(/"/g, '')));

console.log('Total matches:', matches.length);
console.log('Unique assets found:', uniqueAssets.size);

// List them out to check
fs.writeFileSync('debug_assets.json', JSON.stringify(Array.from(uniqueAssets), null, 2));
