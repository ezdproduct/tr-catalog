
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public', 'catalog');

if (fs.existsSync(PUBLIC_DIR)) {
    console.log(`Deleting ${PUBLIC_DIR}...`);
    fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
    console.log('Cleanup completed.');
} else {
    console.log('Directory already removed.');
}
