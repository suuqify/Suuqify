"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteStoreAction } from "@/actions/store/settings";
import { StoreData } from "./types";

interface DangerTabProps {
    store: StoreData;
}

export function DangerTab({ store }: DangerTabProps) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const handleDeleteStore = async () => {
        startTransition(async () => {
            const toastId = toast.loading("Dukaanka waa la tirtirayaa...");
            const res = await deleteStoreAction();
            if (res.error) {
                toast.error(res.error, { id: toastId });
            } else {
                toast.success("Dukaankaaga si buuxda ayaa loo tirtiray!", { id: toastId });
                router.push("/onboarding");
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card className="border-destructive/30 shadow-xs">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-destructive flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Tirtir Dukaankaaga
                    </CardTitle>
                    <CardDescription>
                        Talaabadani waxay si joogto ah u tirtiraysaa dukaankaaga iyo dhammaan alaabta ku dhex jirta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive leading-relaxed space-y-1">
                        <p className="font-semibold">Fadlan ogow intaadan tirtirin:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            <li>Dhammaan alaabtaada (Products) iyo sawirradooda si joogto ah ayaa loo tirtirayaa.</li>
                            <li>Link-gaaga dukaanku wuxuu noqonayaa mid aan jirin.</li>
                            <li>Akoonkaaga Google wuu sii jiri doonaa, waxaadna mar kasta furan kartaa dukaan cusub.</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-destructive/10 pt-4 flex justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger className={buttonVariants({ variant: "destructive", size: "sm" })}>
                            <Trash2 className="w-4 h-4 mr-1.5" />
                            Tirtir Dukaanka
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-destructive">
                                    Ma hubtaa inaad tirtirto dukaanka?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Ficilkan dib looma noqon karo. Dukaanka <strong>"{store.name}"</strong> iyo dhammaan xogtiisa si joogto ah ayaa loo tirtirayaa.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Ka noqo</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteStore}
                                    className="bg-destructive text-white hover:bg-destructive/90 font-semibold"
                                >
                                    Haa, Tirtir Dukaanka
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}