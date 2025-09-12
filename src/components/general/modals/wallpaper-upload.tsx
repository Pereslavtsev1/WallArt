'use client';

import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createWallpaperWithExistingTags } from '@/actions/wallpaper-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import type { Tag } from '@/db/schema';
import { uploadFile } from '@/services/S3-service';
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
  width: number;
  height: number;
};
const schema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  description: z.optional(z.string()),
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'File is required.',
  }),
});

const WallpaperUpload = ({ tags }: { tags: Tag[] }) => {
  const { open, toggle } = useUploadWallpaperStore();
  const [file, setFile] = useState<UploadFile>();
  const { userId } = useAuth();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
    setValue,
    reset,
    clearErrors,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const onFileSelect = useCallback(
    (acceptedFile: File) => {
      const previewUrl = URL.createObjectURL(acceptedFile);
      const image = new Image();
      image.src = previewUrl;

      image.onload = () => {
        const newFile: UploadFile = {
          key: uuid(),
          file: acceptedFile,
          uploading: false,
          progress: 0,
          uploaded: false,
          error: false,
          previewUrl,
          width: image.naturalWidth,
          height: image.naturalHeight,
        };
        setFile(newFile);
      };

      setValue('file', acceptedFile, { shouldValidate: true });
    },
    [setValue],
  );

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!userId) {
      toast.error('Authentication Required', {
        description: 'You must be logged in to upload a wallpaper.',
      });
      return;
    }
    if (!file) {
      toast.error('No image selected');
      return;
    }
    try {
      const key = await uploadFile(data.file);
      if (key) {
        const res = await createWallpaperWithExistingTags({
          width: file.width,
          height: file.height,
          title: data.title,
          userId: userId,
          fileKey: key,
          description: data.description,
          tags: selectedTags,
        });
        if (res.success) {
          toast.success('Wallpaper Uploaded', {
            description: 'Your wallpaper has been successfully uploaded!',
          });
        } else {
          console.error(res.error);
          toast.error('Upload Failed', {
            description:
              'An unexpected error occurred during the upload process.',
          });
        }
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

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset({ title: '', description: '', file: undefined });
      setFile(undefined);
    }
    toggle();
  };
  return (
    <ImageUploadDialog
      open={open}
      className='ring-0'
      onOpenChange={handleDialogChange}
    >
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
          {/* FIXME: fix bug with scroll */}
          <div className='flex flex-col gap-y-2'>
            <Label className='text-sm font-semibold'>Tags</Label>
            <MultiSelect>
              <MultiSelectTrigger className='w-full dark:bg-background dark:hover:bg-background'>
                <MultiSelectValue
                  overflowBehavior={'wrap'}
                  className='font-semibold text-muted-foreground'
                />
              </MultiSelectTrigger>
              <MultiSelectContent className='bg-background'>
                <MultiSelectGroup className='bg-background font-semibold text-muted-foreground text-xs'>
                  {tags.map((tag) => (
                    <MultiSelectItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => {
                        setSelectedTags((prev) => [...prev, tag]);
                      }}
                    >
                      {tag.name}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
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
          <Button
            type='submit'
            className='font-semibold'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
        </ImageUploadDialog.Footer>
      </form>
    </ImageUploadDialog>
  );
};

export default WallpaperUpload;
