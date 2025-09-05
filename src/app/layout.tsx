import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/view/Navbar";

export const metadata = { title: "Article App" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="bottom-right" richColors/>
        <main>{children}</main>
      </body>
    </html>
  );
}
