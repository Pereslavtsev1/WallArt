import Image from 'next/image';
import type { ReactNode } from 'react';

interface ImageCardRootProps {
  children: ReactNode;
  className?: string;
}

interface ImageCardImageProps {
  src: string;
  alt: string;
  children?: ReactNode;
  asChild?: boolean;
}

interface ImageCardInfoProps {
  title: string;
  description?: string | null;
}

interface ImageCardActionsProps {
  children: ReactNode;
}

const ImageCard = ({ children, className }: ImageCardRootProps) => {
  return (
    <div
      className={`${className ?? ''} relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm`}
    >
      {children}
    </div>
  );
};

const ImageComponent = ({
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
        <div className='relative aspect-video'>
          <Image
            src={src || '/placeholder.svg'}
            alt={alt}
            fill
            className='object-cover'
          />
        </div>
      )}
    </div>
  );
};

const Info = ({ title, description }: ImageCardInfoProps) => {
  return (
    <div className='flex-1 px-4 py-4'>
      <h3 className='text-lg font-semibold'>{title}</h3>
      {description && (
        <p className='line-clamp-2 text-sm font-semibold text-muted-foreground'>
          {description}
        </p>
      )}
    </div>
  );
};

const Actions = ({ children }: ImageCardActionsProps) => {
  return (
    <div className='flex items-center space-x-2 px-4 pb-4'>{children}</div>
  );
};
ImageCard.Image = ImageComponent;
ImageCard.Info = Info;
ImageCard.Actions = Actions;

export default ImageCard;
