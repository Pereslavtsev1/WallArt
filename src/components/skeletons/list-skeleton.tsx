import { Skeleton } from '../ui/skeleton';

type SkeletonListProps = {
  length?: number;
  className: string;
  skeletonStyles: string;
};

const SkeletonList = ({
  length = 7,
  className,
  skeletonStyles,
}: SkeletonListProps) => {
  return (
    <ul className={className}>
      {Array.from({ length }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <li key={index}>
          <Skeleton className={skeletonStyles} />
        </li>
      ))}
    </ul>
  );
};

export default SkeletonList;
