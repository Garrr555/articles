import AdminSidebar from "@/components/view/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1  bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
}
