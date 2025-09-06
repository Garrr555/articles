/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getProfile } from "@/lib/apiAuth";
import { clearAuth } from "@/lib/auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Loader2Icon, LogOutIcon } from "lucide-react";

interface NavbarProps {
  invert?: boolean | false;
  useName?: boolean | false;
  name?: string;
}

type Profile = {
  id: string;
  username: string;
  role: "User" | "Admin";
};

export default function Navbar(props: NavbarProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { invert, useName, name } = props;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        console.error(
          "Navbar profile error:",
          err.response?.data || err.message
        );
        toast.error("Failed to fetch profile, please login again");
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles the logout action by clearing the auth tokens and redirecting the user
   * to the login page.
   */
/*******  21b112c2-7cb2-493d-a034-14521e379bc5  *******/  const handleLogout = () => {
    setLoading(true);
    clearAuth();
    toast.success("Logged out");
    router.push("/login");
    setLoading(false);
  };

  const avatarLetter = profile?.username
    ? profile.username.charAt(0).toUpperCase()
    : "?";

  return (
    <div
      className={`flex bg-white sm:bg-transparent justify-between items-center w-full px-10 py-5 ${
        invert ? "" : "border-b"
      }`}
    >
      {/* Logo */}
      <button onClick={() => router.push("/")}>
        {useName ? (
          <div>
            <p className="text-2xl font-semibold">{name}</p>
          </div>
        ) : (
          <div>
            <Image
              src={"/logo2.svg"}
              width={150}
              height={150}
              alt={"logo"}
              className={`${invert ? "sm:invert sm:brightness-0" : ""}`}
            />
          </div>
        )}
      </button>

      {/* Avatar + Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 focus:outline-none">
            <div className="rounded-full py-2 px-4 bg-[#BFDBFE] flex items-center justify-center font-bold text-lg text-[#1E3A8A]">
              {avatarLetter}
            </div>
            <p
              className={`underline hidden sm:flex ${
                invert ? "text-white" : ""
              }`}
            >
              {profile?.username || "Guest"}
            </p>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {profile?.role === "Admin" && (
            <div>
              <DropdownMenuItem onClick={() => router.push("/admin/articles")}>
                Admin Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </div>
          )}

          {/* Logout with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 font-semibold cursor-pointer"
              >
                <LogOutIcon className="mr-2 text-red-700" />
                Logout
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-[#2563EB] hover:bg-[#2563EB]/80 text-white"
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Logout"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
