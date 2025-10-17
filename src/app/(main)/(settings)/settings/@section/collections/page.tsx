import CollectionsSectionContent from '@/components/sections/collections-section/collection-section-content';
import CollectionsSectionHeader from '@/components/sections/collections-section/collection-section-header';
import {
  Section,
  SectionContent,
  SectionHeader,
} from '@/components/sections/section';

export default async function CollectionSection() {
  return (
    <Section>
      <SectionHeader className='flex items-center justify-between'>
        <CollectionsSectionHeader />
      </SectionHeader>
      <SectionContent>
        <CollectionsSectionContent />
      </SectionContent>
    </Section>
  );
}
