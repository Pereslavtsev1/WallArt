import { CollectionListWrapper } from '@/components/general/collection-list/collection-list-wrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { findAllCurrentUserCollectionsAction } from '@/server/actions/collection-actions';

export default async function CollectionSection() {
  const collections = findAllCurrentUserCollectionsAction({
    columns: {
      id: true,
      title: true,
      description: true,
      wallpaperCount: true,
    },
  });
  return (
    <Card className='bg-background'>
      <CardHeader className='font-semibold'>
        <CardTitle>Collections</CardTitle>
        <CardDescription>Browse our wallpaper collections.</CardDescription>
      </CardHeader>
      <CardContent>
        <CollectionListWrapper collections={collections} />
      </CardContent>
    </Card>
  );
}
