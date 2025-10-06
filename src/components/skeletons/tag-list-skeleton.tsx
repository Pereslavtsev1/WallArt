import SkeletonList from './list-skeleton';

export default function TagListSkeleton() {
  return (
    <SkeletonList
      length={20}
      className={'flex gap-x-2'}
      skeletonStyles={'h-9 w-44'}
    />
  );
}
