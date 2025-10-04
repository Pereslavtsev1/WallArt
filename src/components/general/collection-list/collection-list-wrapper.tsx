'use client';

import type { Result } from '@/db';
import { Stream, type Streamable } from '../utils/stream';
import type { CollectionCardProps } from './collection-card';
import CollectionList from './collection-list';

export type CollectionListWrapperProps = {
  className?: string;
  collections: Streamable<Result<CollectionCardProps[]>>;
};
export function CollectionListWrapper({
  collections,
  className,
}: CollectionListWrapperProps) {
  return (
    <Stream value={collections} fallback={undefined} errorFallback={undefined}>
      {(data) => {
        if (!data.success) throw new Error(data.error);

        return <CollectionList collections={data.data} className={className} />;
      }}
    </Stream>
  );
}
