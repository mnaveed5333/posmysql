"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out!");
    router.push("/login");
  };

  return (
    <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <p className="text-sm text-gray-400">Welcome, Admin 👋</p>
      <button
        onClick={handleLogout}
        className="text-sm text-red-400 hover:text-red-600 font-semibold"
      >
        Logout
      </button>
    </div>
  );
}