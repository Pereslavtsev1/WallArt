'use client';

import { UploadCloudIcon } from 'lucide-react';
import { useCallback } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/utils/functions';

type DropZoneProps = {
  className?: string;
  onFileSelected: (file: File) => void;
  maxFiles?: number;
  accept?: { [key: string]: string[] };
  maxSize?: number;
};

const Dropzone = ({
  className,
  onFileSelected,
  maxFiles = 1,
  accept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/gif': ['.gif'],
  },
  maxSize = 10 * 1024 * 1024,
}: DropZoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        acceptedFiles.map((acceptedFile) => onFileSelected(acceptedFile));
      }
    },
    [onFileSelected],
  );

  const handleRejectedFiles = useCallback(
    (rejectedFiles: FileRejection[]) => {
      const hasLargeFile = rejectedFiles.some(
        (rejection) => rejection.errors[0]?.code === 'file-too-large',
      );
      const hasTooManyFiles = rejectedFiles.some(
        (rejection) => rejection.errors[0]?.code === 'too-many-files',
      );
      const hasInvalidType = rejectedFiles.some(
        (rejection) => rejection.errors[0]?.code === 'file-invalid-type',
      );

      if (hasLargeFile) {
        toast.error(`File size exceeds the ${formatFileSize(maxSize)} limit.`);
      }
      if (hasTooManyFiles) {
        toast.error('You can only upload one file at a time.');
      }
      if (hasInvalidType) {
        toast.error('Please upload only image files.');
      }
    },
    [maxSize],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    maxSize,
    onDropRejected: handleRejectedFiles,
  });

  return (
    <div
      className={cn(
        'cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground p-12 text-center transition-colors',
        isDragActive && 'border-green-500',
        className,
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className='space-y-2'>
        <UploadCloudIcon className='mx-auto size-12' />
        <div>
          <p className='text-sm'>
            {isDragActive
              ? 'Drop the file here...'
              : 'Click to upload or drag and drop'}
          </p>
          <p className='text-xs'>PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
