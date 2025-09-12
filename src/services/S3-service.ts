import { v4 as uuid } from 'uuid';

export async function getPresignedUrl({
  key,
  filename,
  contentType,
  size,
}: {
  key: string;
  filename: string;
  contentType: string;
  size: number;
}) {
  try {
    const response = await fetch('/api/s3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, filename, contentType, size }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get presigned URL: ${response.status}. Message: ${response.body};
        }`,
      );
    }

    return response.json();
  } catch (error) {
    console.error('GetPresignedUrl error:', error);
    return null;
  }
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const presignedUrlResponse = await getPresignedUrl({
    key: uuid(),
    filename: file.name,
    contentType: file.type,
    size: file.size,
  });

  if (!presignedUrlResponse) {
    throw new Error('Failed to obtain presigned URL.');
  }

  const { presignedUrl, key } = presignedUrlResponse;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress?.(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve(key);
      } else {
        reject(
          new Error(
            `Upload failed: ${xhr.status} - ${xhr.statusText || 'Unknown error'}`,
          ),
        );
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.ontimeout = () => reject(new Error('Upload timeout.'));

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.timeout = 60_000;
    xhr.send(file);
  });
}
