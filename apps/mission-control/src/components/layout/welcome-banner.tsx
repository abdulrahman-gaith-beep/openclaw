"use client";

import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  onManageProfiles: () => void;
  className?: string;
}

export function WelcomeBanner({ onManageProfiles, className }: WelcomeBannerProps) {
  return (
    <div
      role="status"
      className={
        "flex items-center justify-between gap-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm " +
        (className ?? "")
      }
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="w-4 h-4 text-primary shrink-0" />
        <span>
          Create or join a workspace to get started. Connect your gateway and create your first task.
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={onManageProfiles} className="shrink-0 gap-2">
        <Users className="w-3.5 h-3.5" />
        Manage profiles
      </Button>
    </div>
  );
}
