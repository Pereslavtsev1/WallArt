'use server';
import 'server-only';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { S3 } from '@/lib/s3/S3';

interface UploadParams {
  type: 'upload';
  filename: string;
  contentType: string;
  size: number;
  key?: string;
  expiresIn?: number;
}

interface DownloadParams {
  type: 'download';
  key: string;
  expiresIn?: number;
}

type PresignParams = UploadParams | DownloadParams;

export async function getPresignedUrl(params: PresignParams) {
  let command: PutObjectCommand | GetObjectCommand;
  let key: string;

  switch (params.type) {
    case 'upload':
      key = params.key || uuid();
      command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: params.contentType,
        ContentLength: params.size,
      });
      break;

    case 'download':
      key = params.key;
      command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });
      break;

    default:
      throw new Error(`Unknown presign type: ${(params as any).type}`);
  }

  const presignedUrl = await getSignedUrl(S3, command, {
    expiresIn: params.expiresIn ?? 360,
  });

  return params.type === 'upload' ? { presignedUrl, key } : { presignedUrl };
}

export async function uploadFile(file: File) {
  const presignedUrlResponse = await getPresignedUrl({
    type: 'upload',
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
