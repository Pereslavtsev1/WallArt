"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../components/general/header";
import { Button } from "../components/ui/button";

function Home() {
  const router = useRouter();
  return (
    <div>
      <Header />
      <div className="py-10">
        <Button variant="default" onClick={() => router.push("/upload-image")}>
          <Plus /> Upload image
        </Button>
      </div>
    </div>
  );
}

export default Home;
