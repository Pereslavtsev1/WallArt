import { Skeleton } from '../ui/skeleton';

type CollectionListSkeletonProps = {
  className?: string;
  length?: number;
  ref?: React.RefObject<HTMLUListElement> | ((node?: Element | null) => void);
};
export default function CollectionListSkeleton({
  length = 5,
  className,
  ref,
}: CollectionListSkeletonProps) {
  return (
    <ul className={className} ref={ref}>
      {Array.from({ length }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <li key={index}>
          <Skeleton className={'h-44 mb-2 break-inside-avoid'} />
        </li>
      ))}
    </ul>
  );
}
