'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUploadWallpaper } from '@/hooks/use-upload-wallpaper'
import S3Service from '@/services/S3-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import Dropzone from '../dropzone/dropzone-input'
import { SelectedImagePreview } from '../selected-image-preview/selected-image-preview'
import ImageUploadDialog from './image-upload'

export type UploadFile = {
  key: string
  file: File
  uploading: boolean
  progress: number
  uploaded: boolean
  error: boolean
  previewUrl: string
}
const schema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  description: z.optional(z.string()),
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'File is required.',
  }),
})

const WallpaperUpload = () => {
  const { open, toggle } = useUploadWallpaper()
  const [file, setFile] = useState<UploadFile>()

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    Promise.all([S3Service.uploadFile(data.file)])
    console.log('here')
    reset()
  }

  const onFileSelect = useCallback(
    (acceptedFile: File) => {
      const file = acceptedFile
      const newFile = {
        key: uuid(),
        file,
        uploading: false,
        progress: 0,
        uploaded: false,
        error: false,
        previewUrl: URL.createObjectURL(file),
      }
      setFile(newFile)
      setValue('file', acceptedFile, { shouldValidate: true })
      trigger('file')
    },
    [setValue, trigger]
  )
  return (
    <ImageUploadDialog open={open} className="ring-0" onOpenChange={toggle}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <ImageUploadDialog.Header
          title="Upload Wallpaper"
          description="Drag and drop your image here, or click to select a file."
          className="font-semibold"
        />

        <ImageUploadDialog.Content>
          <div className="flex flex-col gap-y-2">
            <Label className="text-sm font-semibold">Title</Label>
            <Input
              variant="ghost"
              {...register('title')}
              className="text-sm font-semibold"
            />
            {errors.title && (
              <p className="text-xs font-semibold text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="text-sm font-semibold">
              Wallpaper Description
            </Label>
            <Textarea
              id="message"
              placeholder="Enter your message"
              {...register('description')}
              variant="ghost"
              rows={4}
              className="resize-none text-sm font-semibold placeholder:font-semibold"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            {file ? (
              <SelectedImagePreview
                file={file}
                onRemove={() => setFile(undefined)}
              />
            ) : (
              <Dropzone
                className="border-input font-semibold text-muted-foreground"
                onFileSelected={onFileSelect}
                maxFiles={1}
                maxSize={10 * 1024 * 1024}
              />
            )}
            {errors.file && (
              <p className="text-xs font-semibold text-red-500">
                Please select a wallpaper file.
              </p>
            )}
          </div>
        </ImageUploadDialog.Content>

        <ImageUploadDialog.Footer>
          <Button type="submit" className="font-semibold">
            Upload
          </Button>
          <Button variant="outline" className="font-semibold" onClick={toggle}>
            Cancel
          </Button>
        </ImageUploadDialog.Footer>
      </form>
    </ImageUploadDialog>
  )
}

export default WallpaperUpload
