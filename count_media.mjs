import fs from 'fs';
const txt = fs.readFileSync('./supabase.txt', 'utf8');
const regex = /"[^"]+\.[^"]+"/gi;
const matches = txt.match(regex) || [];
console.log('Total strings with dots:', matches.length);

const imageLike = matches.filter(s => /\.(jpg|png|webp|svg|jpeg|gif|avif|mp4|webm|avif|ico|json|js|css)/i.test(s));
console.log('Strings that look like assets:', imageLike.length);

const set = new Set(imageLike);
console.log('Unique assets:', set.size);

// Print all unique assets to a file so I can inspect
fs.writeFileSync('all_assets_found.json', JSON.stringify(Array.from(set), null, 2));
