import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { S3 } from '@/utils/S3';
import { headers } from 'next/headers';

const uploeadRequestSchema = z.object({
  key: z.string(),
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
});
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = uploeadRequestSchema.safeParse(body);

    if (!validation.success) {
      console.log('here');
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const { contentType, key, size } = validation.data;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    });
    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });

    const response = {
      presignedUrl,
      key: key,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 },
    );
  }
}
const deleteRequestSchema = z.object({
  key: z.string(),
});

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const validation = deleteRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const { key } = validation.data;

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error('Error deleting object from S3:', error);
    return NextResponse.json(
      { error: 'Failed to delete object' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'No key provided' }, { status: 400 });
  }

  console.log(key);
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${key}"`,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });
    console.log(presignedUrl);

    return NextResponse.json({ presignedUrl });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 },
    );
  }
}
