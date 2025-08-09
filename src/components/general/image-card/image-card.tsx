import Image from 'next/image'
import type React from 'react'
import type { ReactNode } from 'react'

interface ImageCardProps {
  className: string
  children: ReactNode
}

interface ImageCardImageProps {
  src: string
  alt: string
  children?: ReactNode
  asChild?: boolean
}

interface ImageCardInfoProps {
  title: string
  description: string
}

interface ImageCardActionsProps {
  children?: ReactNode
}

const ImageCard = ({ children, className }: ImageCardProps) => {
  return (
    <div
      className={`${className} relative flex flex-col gap-y-4 overflow-hidden rounded-lg border bg-background pb-4 shadow-sm`}
    >
      {children}
    </div>
  )
}

const ImageCardImage = ({
  src,
  alt,
  children,
  asChild,
}: ImageCardImageProps) => {
  return (
    <div>
      {asChild ? (
        children
      ) : (
        <div className="relative aspect-video">
          <Image src={src} alt={alt} fill className="object-cover" />
        </div>
      )}
    </div>
  )
}

const ImageCardInfo = ({ title, description }: ImageCardInfoProps) => {
  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="line-clamp-1 text-sm font-semibold text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

const ImageCardActions = ({ children }: ImageCardActionsProps) => {
  return <div className="flex space-x-2 px-4">{children}</div>
}

ImageCard.Image = ImageCardImage
ImageCard.Info = ImageCardInfo
ImageCard.Actions = ImageCardActions
export default ImageCard
