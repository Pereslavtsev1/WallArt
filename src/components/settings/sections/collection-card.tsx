import type { ElementType, ReactNode } from 'react';

interface CollectionCardRootProps {
  children: ReactNode;
}

const CollectionCardRoot = ({ children }: CollectionCardRootProps) => {
  return (
    <div className='p-2 border rounded-2xl bg-border/10'>
      <div className='rounded-2xl p-6 bg-background'>
        <div>{children}</div>
      </div>
    </div>
  );
};

interface CollectionCardIconProps {
  icon: ElementType;
}

const CollectionCardIcon = ({ icon: Icon }: CollectionCardIconProps) => {
  return (
    <div className='bg-neutral-900 size-10 flex items-center justify-center rounded-full mb-4'>
      <Icon className='size-5' />
    </div>
  );
};

interface CollectionCardTitleProps {
  children: ReactNode;
}

const CollectionCardTitle = ({ children }: CollectionCardTitleProps) => {
  return <h2 className='font-semibold text-lg mb-2 truncate'>{children}</h2>;
};

interface CollectionCardDescriptionProps {
  children: ReactNode;
}

const CollectionCardDescription = ({
  children,
}: CollectionCardDescriptionProps) => {
  return (
    <p className='text-muted-foreground font-semibold text-sm truncate'>
      {children}
    </p>
  );
};

const CollectionCard = Object.assign(CollectionCardRoot, {
  Icon: CollectionCardIcon,
  Title: CollectionCardTitle,
  Description: CollectionCardDescription,
});

export default CollectionCard;
