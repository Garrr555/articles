import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(6, "Please enter your password"),
});
export const registerSchema = z.object({
  username: z.string().min(3, "Username field cannot be empty"),
  password: z.string().min(6, "Password must be at least 8 characters long"),
  role: z.enum(["User", "Admin"]),
});
