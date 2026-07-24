"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Loader2,
  LogOut,
  Settings as SettingsIcon,
  Shield,
  Tag,
  Trash2,
  User,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyReports: true,
    monthlyReports: false,
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
    // Load preferences from localStorage
    const saved = localStorage.getItem("userPreferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse preferences", e);
      }
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }

    setIsLoading(true);
    try {
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const savePreferences = () => {
    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      toast.success("Preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save preferences");
      console.error(error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const handleManageAccount = () => {
    openUserProfile();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and data
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex items-center justify-center gap-2"
          >
            <SettingsIcon className="hidden h-4 w-4 sm:block" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-4 w-4" />
            Danger
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>
                    {firstName?.[0]}{lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account</p>

                  <p className="text-sm text-muted-foreground">
                    Your profile photo, email and security settings are managed by Clerk.
                  </p>

                  <Button variant="outline" onClick={handleManageAccount}>
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Account
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.emailAddresses[0]?.emailAddress || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed here. Visit{" "}
                  <a 
                    href="https://clerk.com/user" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Clerk Dashboard
                  </a>{" "}
                  to update.
                </p>
              </div>

              <div className="space-y-6">
                <Button
                  className="w-full"
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>

                <div className="border-t pt-6">
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-t pt-6 space-y-4">
                {/* Email Notifications */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summaries and important alerts
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.emailNotifications} 
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, emailNotifications: checked })
                    } 
                  />
                </div>

                {/* Weekly Reports */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Weekly Reports
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get a weekly summary of your spending
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.weeklyReports} 
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, weeklyReports: checked })
                    } 
                  />
                </div>

                {/* Monthly Reports */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Monthly Reports
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get a monthly summary of your spending
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.monthlyReports} 
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, monthlyReports: checked })
                    } 
                  />
                </div>
              </div>

              <Button onClick={savePreferences} className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Tab */}
        <TabsContent value="danger">
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                These actions are permanent and cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="flex items-start gap-2 font-medium text-red-700 dark:text-red-400">
                  <Trash2 className="h-4 w-4" />
                  Delete All Data
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  This will permanently delete all your:
                </p>
                <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside mt-1 space-y-0.5">
                  <li>All transactions</li>
                  <li>All accounts</li>
                  <li>All categories</li>
                  <li>All associated data</li>
                </ul>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                  This action cannot be reversed!
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder='Type "DELETE" to confirm'
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                />

                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={confirmDelete !== "DELETE"}
                >
                  Delete All Data
                </Button>

              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}