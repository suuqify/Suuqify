"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillingPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function BillingPagination({ currentPage, totalPages }: BillingPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between px-2 pt-4">
      <p className="text-xs text-muted-foreground">
        Bogga <span className="font-semibold text-foreground">{currentPage}</span> ee{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 gap-1 text-xs"
        >
          <ChevronLeft className="h-4 w-4" />
          Hore
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 gap-1 text-xs"
        >
          Xiga
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}