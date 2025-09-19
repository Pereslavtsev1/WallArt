'use client';

import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createWallpaperWithTags } from '@/actions/wallpaper-actions';
import type { Tag } from '@/db/schema';
import { uploadFile } from '@/services/S3-service';
import { useUploadWallpaperStore } from '@/stores/upload-wallpaper-store';
import Dropzone from '../general/dropzone/dropzone-input';
import { SelectedImagePreview } from '../general/selected-image-preview/selected-image-preview';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import MultipleSelector from '../ui/multi-select';
import { Textarea } from '../ui/textarea';

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
const fileSchema = z.object(
  {
    file: z
      .instanceof(File, { message: 'File is required' })
      .refine((file) => file.size > 0, { message: 'File cannot be empty' })
      .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: 'File must be smaller than 10MB',
      })
      .refine(
        (file) => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
        {
          message: 'Only PNG, JPEG, or WEBP files are allowed',
        },
      ),
    width: z.number(),
    height: z.number(),
  },
  { message: 'File is required' },
);

const tagSchema = z.object({
  id: z.string().min(1, { message: 'Tag id is required' }),
  name: z.string().min(1, { message: 'Tag name is required' }),
});
const schema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  description: z.optional(z.string()),
  tags: z.optional(z.array(tagSchema)),
  fileData: fileSchema,
});

const CreateWallpaperForm = ({ tags }: { tags: Tag[] }) => {
  const { toggle } = useUploadWallpaperStore();
  const [file, setFile] = useState<UploadFile>();
  const { userId } = useAuth();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    },
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

        form.setValue(
          'fileData',
          {
            file: acceptedFile,
            width: newFile.width,
            height: newFile.height,
          },
          { shouldValidate: true },
        );
      };
    },
    [form],
  );
  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!userId) {
      toast.error('Authentication Required', {
        description: 'You must be logged in to upload a wallpaper.',
      });
      return;
    }

    if (!data.fileData) {
      toast.error('No image selected');
      return;
    }

    try {
      const key = await uploadFile(data.fileData.file);
      if (!key) throw new Error('Failed to upload file');

      const res = await createWallpaperWithTags({
        width: data.fileData.width,
        height: data.fileData.height,
        title: data.title,
        fileKey: key,
        description: data.description,
        tags: selectedTags,
      });

      if (res.success) {
        toast.success('Wallpaper Uploaded', {
          description: 'Your wallpaper has been successfully uploaded!',
        });
      } else {
        toast.error('Upload Failed', {
          description: res.error ?? 'Unexpected error',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload Error', {
        description: 'An unexpected error occurred.',
      });
    } finally {
      toggle();
    }
  };

  console.log(selectedTags);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Enter title'
                  variant='ghost'
                  className='text-sm font-semibold placeholder:font-semibold'
                />
              </FormControl>
              <FormMessage className='text-xs font-semibold' />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className='text-sm font-semibold'>Tags</FormLabel>
          <MultipleSelector
            placeholder='Select tags'
            hidePlaceholderWhenSelected
            options={tags.map((tag) => ({
              id: tag.id,
              label: tag.name,
              value: tag.name,
            }))}
            value={selectedTags.map((tag) => ({
              id: tag.id,
              label: tag.name,
              value: tag.name,
            }))}
            onChange={(value) =>
              setSelectedTags(
                value.map((tag) => ({ id: tag.id, name: tag.label }) as Tag),
              )
            }
            badgeClassName='font-semibold'
          />
        </FormItem>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>
                Wallpaper Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Enter your message'
                  variant='ghost'
                  rows={4}
                  className='resize-none text-sm font-semibold placeholder:font-semibold'
                />
              </FormControl>
              <FormMessage className='text-xs font-semibold' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='fileData'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                {file ? (
                  <SelectedImagePreview
                    file={file}
                    onRemove={() => {
                      setFile(undefined);
                      form.resetField('fileData');
                    }}
                  />
                ) : (
                  <Dropzone
                    className='border-input font-semibold text-muted-foreground'
                    onFileSelected={(file) => {
                      onFileSelect(file);
                      field.onChange(file);
                    }}
                    maxFiles={1}
                    maxSize={10 * 1024 * 1024}
                  />
                )}
              </FormControl>
              {fieldState.error && (
                <FormMessage className='text-xs font-semibold'>
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='font-semibold'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Uploading...' : 'Upload'}
        </Button>
      </form>
    </Form>
  );
};

export default CreateWallpaperForm;
