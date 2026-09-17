"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authStatus = localStorage.getItem("lao_ai_auth") === "true";
    if (!authStatus && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  if (!mounted) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#090d16] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-400 font-medium">ກຳລັງກວດສອບລະບົບ LAO AI OS V3.0...</p>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
