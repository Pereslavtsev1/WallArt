import Header from "@/components/general/header";
import WallpaperList from "@/components/general/wallpapers-lits";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getWallpapers } from "../server/actions";

export default async function Home() {
  const initinalWallpapers = await getWallpapers({ page: 1 });

  return (
    <>
      <Header />
      <div className="pt-10">
        <Button asChild>
          <Link href="/upload-image">Upload Wallpaper</Link>
        </Button>
      </div>
      <WallpaperList
        className="py-10"
        initinalWallpapers={initinalWallpapers}
      />
    </>
  );
}
