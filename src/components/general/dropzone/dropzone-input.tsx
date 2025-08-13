'use client'

import { cn } from '@/lib/utils'
import { UploadCloudIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type DropZoneProps = {
  className?: string
  onFileSelected: (file: File) => void
  maxFiles?: number
  accept?: { [key: string]: string[] }
  maxSize?: number
}

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
        acceptedFiles.map((acceptedFile) => onFileSelected(acceptedFile))
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    maxSize,
  })

  return (
    <div
      className={cn(
        'cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground p-12 text-center transition-colors',
        isDragActive && 'border-green-500',
        className
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <UploadCloudIcon className="mx-auto size-12" />
        <div>
          <p className="text-sm">
            {isDragActive
              ? 'Drop the file here...'
              : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  )
}

export default Dropzone
