'use client';

import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createWallpaper } from '@/actions/wallpaper-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import S3Service from '@/services/S3-service';
import { useUploadWallpaperStore } from '@/stores/upload-wallpaper-store';
import Dropzone from '../dropzone/dropzone-input';
import { SelectedImagePreview } from '../selected-image-preview/selected-image-preview';
import ImageUploadDialog from './image-upload';

export type UploadFile = {
  key: string;
  file: File;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  error: boolean;
  previewUrl: string;
};
const schema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  description: z.optional(z.string()),
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'File is required.',
  }),
});

const WallpaperUpload = () => {
  const { open, toggle } = useUploadWallpaperStore();
  const [file, setFile] = useState<UploadFile>();
  const { userId } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
    reset,
    clearErrors,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onFileSelect = useCallback(
    (acceptedFile: File) => {
      const file = acceptedFile;
      const newFile = {
        key: uuid(),
        file,
        uploading: false,
        progress: 0,
        uploaded: false,
        error: false,
        previewUrl: URL.createObjectURL(file),
      };
      setFile(newFile);
      setValue('file', acceptedFile, { shouldValidate: true });
      trigger('file');
    },
    [setValue, trigger],
  );

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!userId) {
      toast.error('Authentication Required', {
        description: 'You must be logged in to upload a wallpaper.',
      });
      return;
    }
    try {
      const key = await S3Service.uploadFile(data.file);
      if (key) {
        await createWallpaper({
          title: data.title,
          description: data.description,
          authorId: userId,
          key: key,
        });
        toast.success('Wallpaper Uploaded', {
          description: 'Your wallpaper has been successfully uploaded!',
        });
      } else {
        console.error('Failed to get a key from S3 upload.');
        toast.error('Upload Failed', {
          description:
            'Could not get a key for the uploaded file. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error uploading wallpaper:', error);
      toast.error('Upload Error', {
        description: 'An unexpected error occurred during the upload process.',
      });
    } finally {
      reset();
      setFile(undefined);
      clearErrors();
      toggle();
    }
  };

  return (
    <ImageUploadDialog open={open} className='ring-0' onOpenChange={toggle}>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <ImageUploadDialog.Header
          title='Upload Wallpaper'
          description='Drag and drop your image here, or click to select a file.'
          className='font-semibold'
        />

        <ImageUploadDialog.Content>
          <div className='flex flex-col gap-y-2'>
            <Label className='text-sm font-semibold'>Title</Label>
            <Input
              variant='ghost'
              {...register('title')}
              className='text-sm font-semibold'
            />
            {errors.title && (
              <p className='text-xs font-semibold text-red-500'>
                {errors.title.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-y-2'>
            <Label className='text-sm font-semibold'>
              Wallpaper Description
            </Label>
            <Textarea
              placeholder='Enter your message'
              {...register('description')}
              variant='ghost'
              rows={4}
              className='resize-none text-sm font-semibold placeholder:font-semibold'
            />
          </div>

          <div className='flex flex-col gap-y-2'>
            {file ? (
              <SelectedImagePreview
                file={file}
                onRemove={() => setFile(undefined)}
              />
            ) : (
              <Dropzone
                className='border-input font-semibold text-muted-foreground'
                onFileSelected={onFileSelect}
                maxFiles={1}
                maxSize={10 * 1024 * 1024}
              />
            )}
            {errors.file && (
              <p className='text-xs font-semibold text-red-500'>
                Please select a wallpaper file.
              </p>
            )}
          </div>
        </ImageUploadDialog.Content>

        <ImageUploadDialog.Footer>
          <Button type='submit' className='font-semibold'>
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
          <Button
            variant='outline'
            className='font-semibold'
            onClick={() => {
              reset();
              clearErrors();
              setFile(undefined);
              toggle();
            }}
          >
            Cancel
          </Button>
        </ImageUploadDialog.Footer>
      </form>
    </ImageUploadDialog>
  );
};

export default WallpaperUpload;
