import { z } from 'zod';

export const fileSchema = z.object(
  {
    file: z
      .instanceof(File, { message: 'File is required' })
      .refine((file) => file.size > 0, {
        message: 'File cannot be empty',
      })
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

export const tagSchema = z.object({
  id: z.string().min(1, { message: 'Tag id is required' }),
  name: z.string().min(1, { message: 'Tag name is required' }),
});
