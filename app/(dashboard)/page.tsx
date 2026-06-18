"use client";

import { Button } from "@//components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts";

export default function Home() {
  const { onOpen } = useNewAccount();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
    
      <Button onClick={onOpen}>
        Add an account
      </Button>
    </div>
  );
}
