import type { Result } from '@/db';
import type { WallpaperWithUser } from '@/db/schema';
import { Stream, type Streamable } from '../utils/stream';

type WallpaperListProps = {
  className: string;
  wallpapers: Streamable<Result<WallpaperWithUser[]>>;
};

const WallpaperList = ({ className, wallpapers }: WallpaperListProps) => {
  return (
    <Stream
      value={wallpapers}
      fallback={<div>Loading...</div>}
      errorFallback={<div>Error</div>}
    >
      {(data) => {
        if (!data.success) throw new Error(data.error);
        return (
          <ul className={className}>
            {data.data.map((wallpaper) => (
              <li key={wallpaper.id}>{wallpaper.title}</li>
            ))}
          </ul>
        );
      }}
    </Stream>
  );
};

export default WallpaperList;
