"use client";

import { useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/actions/store/products/mutation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string | null;
    productName: string;
}

export function DeleteProductDialog({
    open,
    onOpenChange,
    productId,
    productName,
}: DeleteDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!productId) return;
        startTransition(async () => {
            const res = await deleteProductAction(productId);
            if (res.success) {
                toast.success("Alaabta waa la tirtiray");
                onOpenChange(false);
            } else {
                toast.error(res.error || "Khalad ayaa dhacay");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Ma hubtaa inaad tirtirto?</DialogTitle>
                    <DialogDescription className="text-sm">
                        Alaabta <strong>"{productName}"</strong> gabi ahaanba waa la tirtiri doonaa lagamana noqon karo ficilkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Ka noqo
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Haa, Tirtir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}