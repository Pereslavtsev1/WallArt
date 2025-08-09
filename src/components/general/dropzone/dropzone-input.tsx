'use client'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
type DropZoneProps = {
  className?: string
}
const Dropzone = ({ className }: DropZoneProps) => {
  const onDrop = useCallback((acceptedFiles) => {}, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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
        <ImageIcon className="mx-auto size-12" />
        <div>
          <p className="text-sm">
            {isDragActive
              ? 'Drop the file here...'
              : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs">PNG, JPG, GIF up to 10MB (only one file)</p>
        </div>
      </div>
    </div>
  )
}
export default Dropzone
