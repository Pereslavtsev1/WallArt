"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUser();
  if (!user) {
    redirect("/");
  }
  return <>{children}</>;
}
