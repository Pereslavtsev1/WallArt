"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import { Moon, Plus, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const Header = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="flex w-full items-center justify-between gap-4 overflow-x-hidden py-2">
      <div className="flex items-center gap-2">
        <Logo className="size-9 fill-primary" />
        <h1 className="hidden text-xl font-bold tracking-tight sm:flex">
          WallArt
        </h1>
      </div>
      <div className="relative flex w-full max-w-3xs items-center md:max-w-sm lg:max-w-lg">
        <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          type="text"
          variant="ghost"
          placeholder="Search..."
          className="px-10"
        />
      </div>
      <nav className="flex items-center gap-2">
        <SignedOut>
          <Button variant="ghost" onClick={() => router.push("/sign-in")}>
            Login
          </Button>
          <Button variant="ghost" onClick={() => router.push("/sign-up")}>
            Signup
          </Button>
        </SignedOut>
        {!isLoaded ? (
          <Skeleton className="size-9 rounded-full" />
        ) : (
          <SignedIn>
            <Link href="/settings">
              {isLoaded && user?.imageUrl && (
                <Image
                  src={user.imageUrl}
                  alt={`${user.firstName}'s profile`}
                  className="rounded-full"
                  height={36}
                  width={36}
                />
              )}
            </Link>
          </SignedIn>
        )}
      </nav>
    </header>
  );
};

export default Header;
