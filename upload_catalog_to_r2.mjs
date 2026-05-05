
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_DIR = path.join(__dirname, 'public', 'catalog');

const MIME_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
};

async function uploadFile(filePath, key) {
    const fileContent = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    console.log(`Uploading ${key}...`);

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `catalog/${key}`, // Keeping the catalog/ prefix in R2
        Body: fileContent,
        ContentType: contentType,
    });

    try {
        await s3Client.send(command);
        console.log(`Successfully uploaded ${key}`);
    } catch (err) {
        console.error(`Error uploading ${key}:`, err);
    }
}

async function walkDir(dir, base = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.join(base, file).replace(/\\/g, '/');
        if (fs.statSync(fullPath).isDirectory()) {
            await walkDir(fullPath, relativePath);
        } else {
            await uploadFile(fullPath, relativePath);
        }
    }
}

async function startMigration() {
    if (!fs.existsSync(PUBLIC_DIR)) {
        console.error('Directory public/catalog does not exist.');
        return;
    }

    console.log('Starting migration from public/catalog to R2...');
    await walkDir(PUBLIC_DIR);
    console.log('Migration completed.');
}

startMigration();
