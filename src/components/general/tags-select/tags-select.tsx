import { findAllTagsAction } from '@/server/actions/tag-actions';
import MultipleSelector from '@/components/ui/multi-select';
import type { Tag } from '@/db/schema';

export default async function TagsSelect({
  selectedTags,
  onChange,
}: {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
}) {
  const res = await findAllTagsAction();
  if (!res.success) throw new Error(res.error);

  const tags = res.data;

  return (
    <MultipleSelector
      options={tags.map((t) => ({ id: t.id, label: t.name, value: t.name }))}
      value={selectedTags.map((t) => ({
        id: t.id,
        label: t.name,
        value: t.name,
      }))}
      onChange={(v) => onChange(v.map((t) => ({ id: t.id, name: t.label })))}
      badgeClassName='font-semibold'
    />
  );
}
