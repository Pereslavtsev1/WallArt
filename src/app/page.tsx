"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../components/general/header";
import { Button } from "../components/ui/button";
import db from "../db";
import { usersTable } from "../db/schema";

function Home() {
  const router = useRouter();
  console.log(db.select().from(usersTable));
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
