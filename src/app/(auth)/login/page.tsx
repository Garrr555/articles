/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zodSchemas";
import { loginUser, getProfile } from "@/lib/apiAuth";
import { setToken, setRole } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/view/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/view/Footer";
import { useState } from "react";

type Form = { username: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (d: Form) => {
    try {
      setLoading(true);
      const res = await loginUser(d);
      setToken(res.token);

      // fetch profile to get role
      const profile = await getProfile();
      setRole(profile.role);

      toast.success("Login success");
      setLoading(false);
      router.push("/articles");
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error("Username or password is incorrect");
      setLoading(false);
    }
  };

  return (
    <div>
      <Header name="Login" />
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

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2Icon className="animate-spin" /> : "Login"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline"
                >
                  Register
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
