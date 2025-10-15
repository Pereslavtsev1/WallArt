'use server';
import 'server-only';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { S3 } from '@/lib/s3/S3';

export async function getPresignedUrl({
  key,
  contentType,
  size,
}: {
  key: string;
  filename: string;
  contentType: string;
  size: number;
}) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    });
    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });
    return {
      presignedUrl,
      key: key,
    };
  } catch (error) {
    console.error('GetPresignedUrl error:', error);
    return null;
  }
}

export async function uploadFile(file: File) {
  const presignedUrlResponse = await getPresignedUrl({
    key: uuid(),
    filename: file.name,
    contentType: file.type,
    size: file.size,
  });

  if (!presignedUrlResponse) {
    throw new Error('Failed to obtain presigned URL.');
  }
  const response = await fetch(presignedUrlResponse.presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(
      `Upload failed: ${response.status} - ${response.statusText}`,
    );
  }

  return presignedUrlResponse.key;
}
