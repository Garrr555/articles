/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/apiAuth";
import { clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/view/Navbar";

type Profile = {
  id: string;
  username: string;
  role: "User" | "Admin";
};

export default function AdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        if (data.role !== "Admin") {
          toast.error("You are not authorized to access admin page");
          router.push("/"); // arahkan ke home kalau bukan admin
          return;
        }

        setProfile(data);
      } catch (err: any) {
        console.error("Admin page error:", err.response?.data || err.message);
        toast.error("Please login first");
        clearAuth();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="">
      <div className="bg-white">
        <Navbar />
      </div>
    </div>
  );
}
