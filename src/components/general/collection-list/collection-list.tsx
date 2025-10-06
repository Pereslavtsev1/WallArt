import type { Result } from '@/db';
import type { ClassNameProps } from '../tabs';
import { Stream, type Streamable } from '../utils/stream';
import CollectionCard, { type CollectionCardProps } from './collection-card';

type CollectionListProps = {
  collections:
    | Streamable<CollectionCardProps[]>
    | Streamable<Result<CollectionCardProps[]>>;
} & ClassNameProps;
export default function CollectionList({
  collections,
  className,
}: CollectionListProps) {
  return (
    <Stream
      value={collections}
      fallback={<div>Loading...</div>}
      errorFallback={undefined}
    >
      {(data) => {
        if ('success' in data && !data.success) {
          throw new Error(data.error);
        }
        data = Array.isArray(data) ? data : data.data;

        return (
          <ul className={className}>
            {data.map((collection) => (
              <li key={collection.id}>
                <CollectionCard {...collection} />
              </li>
            ))}
          </ul>
        );
      }}
    </Stream>
  );
}
