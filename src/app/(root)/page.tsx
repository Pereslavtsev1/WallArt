import Header from "@/components/general/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="pt-10">
        <Button asChild>
          <Link href="/upload-image">Upload Wallpaper</Link>
        </Button>
      </div>
    </>
  );
}
