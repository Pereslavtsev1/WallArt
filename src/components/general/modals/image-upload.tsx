'use client'

import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImageUploadDialogProps {
  children: ReactNode
  open: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

interface ImageUploadHeaderProps {
  title?: string
  description?: string
  children?: ReactNode
  className?: string
}

interface ImageUploadContentProps {
  children: ReactNode
  className?: string
}

interface ImageUploadFooterProps {
  children: ReactNode
  className?: string
}

const ImageUploadDialog = ({
  children,
  open,
  onOpenChange,
  className,
}: ImageUploadDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className={`${className} max-w-sm sm:max-w-md md:max-w-lg`}>
      {children}
    </DialogContent>
  </Dialog>
)

const ImageUploadDialogHeader = ({
  title,
  description,
  className,
  children,
}: ImageUploadHeaderProps) => (
  <DialogHeader className={className}>
    {children ? (
      children
    ) : (
      <>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </>
    )}
  </DialogHeader>
)

const ImageUploadDialogContent = ({
  children,
  className,
}: ImageUploadContentProps) => (
  <div className={`${className} space-y-4`}>{children}</div>
)

const ImageUploadDialogFooter = ({
  children,
  className,
}: ImageUploadFooterProps) => (
  <DialogFooter className={className}>{children}</DialogFooter>
)

ImageUploadDialog.Header = ImageUploadDialogHeader
ImageUploadDialog.Content = ImageUploadDialogContent
ImageUploadDialog.Footer = ImageUploadDialogFooter

export default ImageUploadDialog
