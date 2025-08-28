import { findAllTags } from '@/actions/tag-actions';
import Header from '@/components/home/header';
import Tags from '@/components/home/tags-list';

export default async function Home() {
  const tags = findAllTags();
  return (
    <div className='max-w-7xl mx-auto'>
      <Header />
      <div>
        <Tags promise={tags} />
      </div>
    </div>
  );
}
