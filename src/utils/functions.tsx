import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UploadFile } from '@/components/forms/create-wallpaper-form';
import type { User } from '@/db/schema';

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export const getStatusIcon = (file: UploadFile) => {
  if (file.uploading) {
    return <Loader2 className='size-4 animate-spin text-blue-500' />;
  }
  if (file.error) {
    return <AlertCircle className='size-4 text-red-500' />;
  }
  if (file.uploaded) {
    return <CheckCircle className='size-4 text-green-500' />;
  }
  return null;
};
export const buildImageUrl = (key: string) => {
  return `https://t3.storage.dev/wall-art/${key}`;
};
export const formantDate = (data: Date) => {
  return data.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const hasFullName = (user: User) => {
  return user.firstName && user.lastName;
};

export async function downloadFile({
  fileKey,
  fileName,
}: {
  fileKey: string;
  fileName: string;
}) {
  try {
    const res = await fetch(`/api/s3?key=${encodeURIComponent(fileKey)}`);
    const { presignedUrl } = await res.json();
    console.log(presignedUrl);
    if (!presignedUrl) throw new Error('Failed to get URL');

    const fileRes = await fetch(presignedUrl);
    if (!fileRes.ok) throw new Error('Error downloading file');

    const blob = await fileRes.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    const filename = fileName || fileKey.split('/').pop() || 'file';
    link.download = filename;

    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Success', {
      description: 'File downloaded successfully.',
    });
  } catch (err) {
    console.error(err);
    toast.error('Error', {
      description: 'Failed to download file. Please try again.',
    });
  }
}
