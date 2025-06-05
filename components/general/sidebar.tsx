"use client";

import { Bell, Palette, Settings, Shield, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("profile");

  const settingsNavigation = [
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          icon: User,
          id: "profile",
        },
        {
          title: "Security",
          icon: Shield,
          id: "security",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          title: "General",
          icon: Settings,
          id: "general",
        },
        {
          title: "Appearance",
          icon: Palette,
          id: "appearance",
        },
        {
          title: "Notifications",
          icon: Bell,
          id: "notifications",
        },
      ],
    },
  ];

  return (
    <aside className="h-dvh overflow-x-hidden">
      <div className="flex h-full flex-col">
        <header className="flex items-center p-6">
          <h2 className="text-xl font-semibold">Settings</h2>
        </header>

        <div className="custom-scrollbar flex-1 overflow-y-auto py-2">
          <nav className="grid gap-4 px-2">
            {settingsNavigation.map((section) => (
              <div key={section.title} className="grid gap-1">
                <h4 className="mb-1 px-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  {section.title}
                </h4>
                <div className="grid gap-1">
                  {section.items.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "flex h-9 w-full justify-start gap-3 rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        activeItem === item.id &&
                          "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                      )}
                      onClick={() => setActiveItem(item.id)}
                    >
                      <item.icon className="ml-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-t-sidebar p-4">
          <div className="rounded-md bg-sidebar-accent/50 p-3">
            <p className="text-xs text-muted-foreground">
              Need help with settings? Check our documentation or contact
              support.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
