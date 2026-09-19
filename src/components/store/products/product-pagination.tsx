"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function ProductsPagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between px-2 pt-2">
            <p className="text-xs text-muted-foreground">
                Bogga <span className="font-medium text-foreground">{currentPage}</span> ee{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="h-8 gap-1 text-xs"
                >
                    <ChevronLeft className="h-4 w-4" /> Dib
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="h-8 gap-1 text-xs"
                >
                    Horay <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}