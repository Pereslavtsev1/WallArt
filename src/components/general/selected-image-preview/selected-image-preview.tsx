import { Button } from '@/components/ui/button'
import { formatFileSize, getStatusIcon } from '@/utils/functions'
import { X } from 'lucide-react'
import Image from 'next/image'
import { UploadFile } from '../modals/wallpaper-upload'

interface SelectedFilePreviewProps {
  file: UploadFile
  onRemove: () => void
}

/**
 * A component to display a preview of a selected file, including its name, size,
 * upload progress, and status. Allows removing the file.
 * @param file The UploadFile object to display.
 * @param onRemove Callback function to execute when the remove button is clicked.
 */
export const SelectedImagePreview = ({
  file,
  onRemove,
}: SelectedFilePreviewProps) => {
  return (
    <>
      <h3 className="text-sm font-semibold">Selected File</h3>
      <div className="space-y-2">
        <div
          key={file.key}
          className="flex items-center justify-between rounded-lg border border-input p-3"
        >
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <Image
              src={
                file.previewUrl ||
                '/placeholder.svg?height=40&width=40&query=file preview'
              }
              alt="Preview"
              width={40}
              height={40}
              className="rounded object-cover"
            />
            <div className="font-semibold">
              <p className="max-w-40 truncate text-sm">{file.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.file.size)}
              </p>
              {file.uploading && (
                <div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {file.progress}% uploaded
                  </p>
                </div>
              )}
              {file.error && (
                <p className="text-xs text-red-500">
                  Upload failed. Please try again.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(file)}
            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              type="button"
              onClick={onRemove}
              disabled={file.uploading || file.uploaded}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
