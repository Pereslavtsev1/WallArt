'use client'
import { Button } from '@/components/ui/button'
import ImageUploadDialog from './image-upload'
import Dropzone from '../dropzone/dropzone-input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { useUploadWallpaper } from '@/hooks/use-upload-wallpaper'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z
const WallpaperUpload = () => {
  const { open, toggle } = useUploadWallpaper()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  return (
    <ImageUploadDialog open={open} className="ring-0" onOpenChange={toggle}>
      <ImageUploadDialog.Header
        title="Upload wallpaper"
        description="Drag and drop your image here, or click to select a file."
        className="font-semibold"
      />
      <ImageUploadDialog.Content>
        <form className="space-y-4">
          <div className="flex flex-col gap-y-2">
            <Label className="text-sm font-semibold">Title</Label>
            <Input variant="ghost" className="text-sm font-semibold" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label className="text-sm font-semibold">
              Wallpaper description
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              required
              variant="ghost"
              rows={4}
              className="resize-none text-sm font-semibold placeholder:font-semibold"
            />
          </div>
          <Dropzone className="border-input font-semibold text-muted-foreground" />
        </form>
      </ImageUploadDialog.Content>
      <ImageUploadDialog.Footer>
        <Button type="submit">Upload</Button>
        <Button
          variant="outline"
          onClick={() => {
            toggle()
          }}
        >
          Cancel
        </Button>
      </ImageUploadDialog.Footer>
    </ImageUploadDialog>
  )
}

export default WallpaperUpload
