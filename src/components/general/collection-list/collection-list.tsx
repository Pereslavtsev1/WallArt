import type { ClassNameProps } from '../tabs';
import CollectionCard, { type CollectionCardProps } from './collection-card';

type CollectionListProps = {
  collections: CollectionCardProps[];
} & ClassNameProps;
export default function CollectionList({
  collections,
  className,
}: CollectionListProps) {
  return (
    <ul className={className}>
      {collections.map((collection) => (
        <li key={collection.id}>
          <CollectionCard {...collection} />
        </li>
      ))}
    </ul>
  );
}
