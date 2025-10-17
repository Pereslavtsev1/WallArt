'use server';
import {
  Section,
  SectionContent,
  SectionHeader,
} from '@/components/sections/section';
import WallpapersSectionContent from '@/components/sections/wallpapers-seciton/wallpapers-section-content';
import WallpapersSecitonHeader from '@/components/sections/wallpapers-seciton/wallpapers-section-header';

export default async function WallpapersSection() {
  return (
    <Section>
      <SectionHeader className='flex items-center justify-between'>
        <WallpapersSecitonHeader />
      </SectionHeader>
      <SectionContent>
        <WallpapersSectionContent />
      </SectionContent>
    </Section>
  );
}
