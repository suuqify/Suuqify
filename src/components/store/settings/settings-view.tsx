"use client";

import { Store, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StoreData, City, Category } from "./types";
import { GeneralTab } from "./general-tab";
import { BrandingTab } from "./branding-tab";
import { DangerTab } from "./danger-tab";

interface SettingsViewProps {
    store: StoreData;
    userEmail: string;
    cities: City[];
    categories: Category[];
}

export function SettingsView({ store, userEmail, cities, categories }: SettingsViewProps) {
    return (
        <div className="space-y-6 max-w-4xl pb-16">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Qaabeynta Ganacsiga</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Maamul macluumaadka Ganacsigaaga, muuqaalka guud, iyo tirtirka Ganacsiga.
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-md h-11 p-1 bg-muted/60 rounded-xl">
                    <TabsTrigger value="general" className="rounded-lg text-xs md:text-sm font-medium gap-1.5">
                        <Store className="w-4 h-4" />
                        <span className="hidden sm:inline">Xogta Guud</span>
                        <span className="sm:hidden">Guud</span>
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="rounded-lg text-xs md:text-sm font-medium gap-1.5">
                        <ImageIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Sawirrada</span>
                        <span className="sm:hidden">Sawirro</span>
                    </TabsTrigger>
                    <TabsTrigger value="danger" className="rounded-lg text-xs md:text-sm font-medium gap-1.5 text-destructive data-[state=active]:text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Tirtirka</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                    <GeneralTab
                        store={store}
                        userEmail={userEmail}
                        cities={cities}
                        categories={categories}
                    />
                </TabsContent>

                <TabsContent value="branding" className="mt-6">
                    <BrandingTab store={store} />
                </TabsContent>

                <TabsContent value="danger" className="mt-6">
                    <DangerTab store={store} />
                </TabsContent>
            </Tabs>
        </div>
    );
}