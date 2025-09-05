/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/zodSchemas";
import { registerUser, loginUser, getProfile } from "@/lib/apiAuth";
import { setToken, setRole } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Header from "@/components/view/Header";
import Footer from "@/components/view/Footer";

type Form = {
  username: string;
  password: string;
  role: "User" | "Admin";
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "User" },
  });

  const onSubmit = async (d: Form) => {
    try {
      console.log("Register payload:", d);
      await registerUser(d);

      // auto login
      const res = await loginUser({
        username: d.username,
        password: d.password,
      });
      setToken(res.token);

      const profile = await getProfile();
      setRole(profile.role);

      toast.success("Registered and logged in");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div>
      <Header name="Register" />
      <div className="flex items-center justify-center min-h-screen bg-white sm:bg-gray-100">
        <Card className="w-full max-w-sm rounded-2xl">
          <CardHeader className="flex flex-col items-center justify-center space-y-2">
            <div className="flex gap-1 justify-center items-center text-2xl font-bold text-[#000150]">
              <Image src={"/logo2.svg"} width={200} height={200} alt={"logo"} />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <Label className="text-sm font-medium">Username</Label>
                <Input
                  type="text"
                  placeholder="Input username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {String(errors.username?.message)}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Input password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {String(errors.password?.message)}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-1">
                <Label>Role</Label>
                <Select
                  defaultValue="User"
                  onValueChange={(value: "User" | "Admin") =>
                    setValue("role", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">
                    {String(errors.role?.message)}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Register
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
