import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create unique filename
        const fileExtension = file.name.split('.').pop() || 'tmp';
        const fileName = `${uuidv4()}-${Date.now()}.${fileExtension}`;
        const contentType = file.type || 'application/octet-stream';

        // Upload to Cloudflare R2
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: contentType,
        }));

        // Construct the public URL
        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: fileName
        });
    } catch (error) {
        console.error('Error uploading to R2:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
}
