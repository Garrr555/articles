"use client";

import { cn } from "@/lib/utils";
import { FileText, Loader2Icon, LogOut, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { name: "Articles", href: "/admin/articles", icon: FileText },
  { name: "Category", href: "/admin/category", icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    // contoh: hapus token & redirect ke login
    localStorage.removeItem("token");
    window.location.href = "/login";
    setLoading(false);
  };

  return (
    <aside className="text-white fixed left-0 top-0 h-screen w-64 bg-[#2563EB] flex flex-col">
      {/* Logo */}
      <Link href={"/"}>
        <div className="h-16 flex items-center px-5 mt-4">
          <Image
            src={"/logo2.svg"}
            width={150}
            height={120}
            alt={"logo"}
            className="invert brightness-0"
          />
        </div>
      </Link>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-[#3B82F6] text-white"
                  : "text-white hover:bg-[#3B82F6]"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        {/* Logout pakai Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left hover:bg-[#3B82F6]"
              )}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to logout?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="bg-[#2563EB] hover:bg-[#2563EB]/80 text-white"
              >
                {loading ? <Loader2Icon className="animate-spin" /> : "Logout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
    </aside>
  );
}
