"use client";

import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";

export const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();
  
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="space-y-1">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">
        Welcome Back{isLoaded ? `, ${user?.firstName}` : ""}! 👋
      </h2>

      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Here's your financial overview
        </p>
        <span className="text-xs text-muted-foreground/50">•</span>
        <p className="text-xs text-muted-foreground/70">
          {today}
        </p>
      </div>
    </div>
  );
};