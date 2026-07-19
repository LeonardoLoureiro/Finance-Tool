// components/welcome-msg.tsx

"use client";

import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold tracking-tight">
        Welcome Back{isLoaded ? `, ${user?.firstName}` : ""}! 👋
      </h2>

      <p className="text-sm text-muted-foreground">
        Here's your financial overview
      </p>
    </div>
  );
};