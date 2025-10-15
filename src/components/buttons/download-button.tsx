'use client';
import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { getPresignedUrl } from '@/services/S3-service';
import { Button, type buttonVariants } from '../ui/button';

export default function DownloadButton({
  fileKey,
  children,
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & {
  children: ReactNode;
  fileKey: string;
} & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const handleDownload = async () => {
    try {
      const { presignedUrl } = await getPresignedUrl({
        type: 'download',
        key: fileKey,
      });
      if (!presignedUrl) throw new Error('Failed to get presigned URL');

      const response = await fetch(presignedUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      const filename = fileKey.split('/').pop() || 'file';
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Button {...props} onClick={handleDownload}>
      {children}
    </Button>
  );
}
