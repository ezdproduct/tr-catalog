
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncR2ToMedia() {
    console.log('Fetching objects from R2...');
    const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
    });

    try {
        const response = await s3Client.send(command);
        const objects = response.Contents || [];
        console.log(`Found ${objects.length} objects in R2.`);

        if (objects.length > 0) {
            const mediaRecords = objects.map(obj => {
                const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${obj.Key}`;
                const type = obj.Key.split('.').pop().toLowerCase();
                return {
                    url: publicUrl,
                    type: type,
                    metadata: { size: obj.Size, lastModified: obj.LastModified }
                };
            });

            console.log(`Upserting ${mediaRecords.length} records into Supabase 'media' table...`);
            const { error } = await supabase.from('media').upsert(mediaRecords, { onConflict: 'url' });
            if (error) throw error;
            console.log('Sync completed successfully.');
        } else {
            console.log('No objects found in R2 bucket.');
        }
    } catch (err) {
        console.error('Error syncing R2 to Media:', err);
    }
}

syncR2ToMedia();
