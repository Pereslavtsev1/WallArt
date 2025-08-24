import { SectionIDs } from '@/stores/settings-store';
import Appearance from './appearance';
import Collections from './collections';
import General from './general';
import MyWallpaper from './my-wallpaper';
import Profile from './profile';
import Security from './security';

export interface SectionFactoryProps {
  sectionId: SectionIDs;
}
class SectionFactory {
  create(sectionId: SectionIDs, userId: string) {
    switch (sectionId) {
      case SectionIDs.PROFILE:
        return <Profile />;
      case SectionIDs.GENERAL:
        return <General />;
      case SectionIDs.APPEARANCE:
        return <Appearance />;
      case SectionIDs.SECURITY:
        return <Security userId={userId} />;
      case SectionIDs.COLLECTIONS:
        return <Collections />;
      case SectionIDs.MYWALLPAPER:
        return <MyWallpaper userId={userId} />;
      default: {
        const exhaustiveCheck: never = sectionId;
        throw new Error(`Unhandled section ID: ${exhaustiveCheck}`);
      }
    }
  }
}

export default SectionFactory;
