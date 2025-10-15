import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function buildImageUrl(fileKey: string) {
  return `https://wall-art.t3.storage.dev/${fileKey}`;
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export const formantDate = (data: Date) => {
  return data.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export type UploadFile = {
  key: string;
  file: File;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  error: boolean;
  previewUrl: string;
  width: number;
  height: number;
};
