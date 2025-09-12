import { Skeleton } from '../ui/skeleton';

interface SkeletonListProps {
  className?: string;
  length?: number;
}

const SkeletonList = ({ className, length = 5 }: SkeletonListProps) => {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Skeleton key={index} className={`break-inside-avoid ${className}`} />
      ))}
    </>
  );
};

export default SkeletonList;
