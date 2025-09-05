/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/apiAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/lib/auth";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/view/Footer";
import Link from "next/link";

type Profile = {
  id: string;
  username: string;
  password: string;
  role: "User" | "Admin";
  createdAt?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        console.error("Profile error:", err.response?.data || err.message);
        toast.error("Failed to fetch profile, please login again");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  const avatarLetter = profile?.username
    ? profile?.username.charAt(0).toUpperCase()
    : "?";

  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-between items-center w-full border-b px-10 py-5">
        <Image src={"/logo2.svg"} width={150} height={150} alt={"logo"} />
        <div className="flex justify-center items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <div className="rounded-full py-2 px-4 bg-[#BFDBFE] flex items-center justify-center font-bold text-lg text-[#1E3A8A]">
                {avatarLetter}
              </div>
              <p className="underline hidden sm:flex">
                {profile?.username || "Guest"}
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* konten */}
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Card className="w-full max-w-sm rounded-2xl">
          <CardHeader className="flex flex-col items-center justify-center space-y-2">
            <div>
              <p className="font-bold text-xl mb-10">User Profile</p>
              <div className="rounded-full p-8 bg-[#BFDBFE] flex items-center justify-center font-bold text-4xl text-[#1E3A8A]">
                {avatarLetter}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* data user */}
            <div className="w-full flex flex-col gap-3">
              <div className="rounded-sm p-2 text-[16px] flex items-center justify-between bg-[#F3F4F6] border border-[#E2E8F0]">
                <div className=" font-semibold w-1/3 flex justify-between items-center ">
                  <p className="">Username</p>
                  <p className=""> : </p>
                </div>
                <p className="w-2/3 text-center ">{profile?.username || "-"}</p>
              </div>
              <div className="rounded-sm p-2 text-[16px] flex items-center justify-between bg-[#F3F4F6] border border-[#E2E8F0]">
                <div className=" font-semibold w-1/3 flex justify-between items-center ">
                  <p className="">Password</p>
                  <p className=""> : </p>
                </div>
                <p className="w-2/3 text-center ">{profile?.password || "-"}</p>
              </div>
              <div className="rounded-sm p-2 text-[16px] flex items-center justify-between bg-[#F3F4F6] border border-[#E2E8F0]">
                <div className=" font-semibold w-1/3 flex justify-between items-center ">
                  <p className="">Role</p>
                  <p className=""> : </p>
                </div>
                <p className="w-2/3 text-center ">{profile?.role || "-"}</p>
              </div>

              <Link href={"/articles"}>
                <div className="mt-8 text-white bg-[#2563EB] text-center py-2 rounded-md cursor-pointer">
                  <p>Back to Home</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
