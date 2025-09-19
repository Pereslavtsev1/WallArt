import { findAllTags } from '@/actions/tag-actions';
import { Button } from '../ui/button';

export default async function TagsList() {
  const res = await findAllTags();
  const tags = res.success ? res.data : [];

  return (
    <>
      {tags.map((tag) => (
        <Button
          key={tag.id}
          className='justify-start font-semibold'
          variant={'ghost'}
        >
          {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
        </Button>
      ))}
    </>
  );
}
