import React from "react";
import { AlertCircle, FileBox, Loader2 } from "lucide-react";

interface DataCardProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataCard({
  children,
  isLoading = false,
  isEmpty = false,
  isError = false,
  errorMessage = "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ",
  emptyMessage = "ບໍ່ມີຂໍ້ມູນ",
  className = "",
}: DataCardProps) {
  if (isLoading) {
    return (
      <div className={`glass-panel p-6 flex flex-col items-center justify-center min-h-[200px] ${className}`}>
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-gray-400 text-sm animate-pulse">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`glass-panel p-6 flex flex-col items-center justify-center min-h-[200px] border-danger/30 ${className}`}>
        <AlertCircle className="w-10 h-10 text-danger mb-4" />
        <p className="text-danger text-sm font-medium">{errorMessage}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={`glass-panel p-6 flex flex-col items-center justify-center min-h-[200px] border-dashed ${className}`}>
        <FileBox className="w-10 h-10 text-gray-600 mb-4" />
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-6 ${className}`}>
      {children}
    </div>
  );
}
