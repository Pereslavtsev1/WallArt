import type { ClassNameProps } from '../tabs';
import { Stream, type Streamable } from '../utils/stream';
import CollectionCard, { type CollectionCardProps } from './collection-card';

type CollectionListProps = {
  items: Streamable<CollectionCardProps[]>;
} & ClassNameProps;
export default function CollectionList({
  items: collections,
  className,
}: CollectionListProps) {
  return (
    <Stream
      value={collections}
      fallback={<div>Loading...</div>}
      errorFallback={undefined}
    >
      {(data) => {
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
