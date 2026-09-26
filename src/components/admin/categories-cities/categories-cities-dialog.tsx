"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TaxonomyDialogProps {
    type: "category" | "city";
    item: { id: string; name: string } | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmitAction: (name: string, id?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export function TaxonomyDialog({
    type,
    item,
    isOpen,
    onClose,
    onSubmitAction,
}: TaxonomyDialogProps) {
    const [name, setName] = useState("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setName(item ? item.name : "");
    }, [item, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Fadlan magaca geli.");
            return;
        }

        startTransition(async () => {
            const res = await onSubmitAction(name, item?.id);
            if (res.success) {
                toast.success(res.message);
                onClose();
            } else {
                toast.error(res.error);
            }
        });
    };

    const title = item
        ? `Wax Ka Beddel ${type === "category" ? "Qaybta" : "Magaalada"}`
        : `Ku Dar ${type === "category" ? "Qayb Cusub" : "Magaalo Cusub"}`;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-sm rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">{title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Magaca (Name)</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={type === "category" ? "e.g. Fashion, Skincare" : "e.g. Muqdisho, Hargeysa"}
                            className="rounded-xl h-10 text-sm"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl h-9 text-xs"
                        >
                            Ka Noqo
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl h-9 text-xs bg-primary text-primary-foreground font-semibold"
                        >
                            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                            {item ? "Cusboonaysii" : "Ku Dar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}