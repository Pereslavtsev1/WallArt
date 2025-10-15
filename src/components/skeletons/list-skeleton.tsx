import { Skeleton } from '../ui/skeleton';

type SkeletonListProps = {
  length?: number;
  className?: string;
  skeletonStyles?: string;
  asChild?: React.ElementType;
};

export default function SkeletonList({
  length = 7,
  className,
  skeletonStyles,
  asChild: CustomSkeleton,
}: SkeletonListProps) {
  const SkeletonComponent = CustomSkeleton || Skeleton;

  return (
    <ul className={className}>
      {Array.from({ length }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <li key={index}>
          <SkeletonComponent className={skeletonStyles} />
        </li>
      ))}
    </ul>
  );
}
