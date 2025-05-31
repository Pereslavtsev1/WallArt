"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="flex items-center justify-between gap-2 p-4">
      <div className="flex items-center gap-2">
        <Logo className="size-7 fill-primary" />
        <h1 className="hidden text-xl font-bold tracking-tight sm:flex">
          WallArt
        </h1>
      </div>
      <div className="px-auto relative flex w-full max-w-lg items-center">
        <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          type="text"
          variant="ghost"
          placeholder="Search..."
          className="py-2 pr-4 pl-10"
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
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="hidden sm:flex"
          aria-label={
            mounted
              ? `Switch to ${theme === "light" ? "dark" : "light"} mode`
              : "Toggle theme"
          }
        >
          {mounted ? (
            theme === "light" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )
          ) : (
            <div className="size-5" />
          )}
        </Button>
      </nav>
    </header>
  );
};

export default Header;
