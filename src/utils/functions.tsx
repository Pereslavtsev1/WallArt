import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import type { UploadFile } from '@/components/general/modals/wallpaper-upload';

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
