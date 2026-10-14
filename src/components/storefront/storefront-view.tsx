"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StorefrontData, StorefrontProduct } from "./types";
import { StorefrontHeader } from "./storefront-header";
import { ProductGrid } from "./product-grid";
import { OrderModal } from "./order-modal";
import { Package, Info, MapPin, ArrowLeft, LayoutDashboard } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface StorefrontViewProps {
    store: StorefrontData;
}

export function StorefrontView({ store }: StorefrontViewProps) {
    const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    
    // Hubi haddii qofka boggan eegaya uu yahay qof Login ku jira (Milkiilaha Dukaanka)
    const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setIsOwnerLoggedIn(true);
            }
        });
    }, []);

    const handleOrder = (product: StorefrontProduct) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    return (
        <div className="relative min-h-screen bg-muted/10 pb-16">
            
            {/* 1. Floating Back to Dashboard Button (Kaliya Milkiilaha Login-ka ah ayaa arkaya) */}
            {isOwnerLoggedIn && (
                <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Link
                        href="/store"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border/80 shadow-md text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group select-none"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Dashboard-ka</span>
                    </Link>
                </div>
            )}

            {/* Header-ka sare */}
            <StorefrontHeader
                name={store.name}
                logoUrl={store.logo_url}
                bannerUrl={store.back_logo_url}
                bio={store.bio}
                isVerified={store.is_verified}
                cityName={store.city?.name}
                categoryName={store.category?.name}
                whatsappNumber={store.whatsapp_number}
            />

            {/* Tabs Container */}
            <div className="max-w-4xl mx-auto px-4 mt-4">
                <Tabs defaultValue="products" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1 rounded-xl h-11">
                        <TabsTrigger value="products" className="gap-1.5 rounded-lg text-xs font-semibold">
                            <Package className="h-4 w-4" /> Bandhigga  ({store.products.length})
                        </TabsTrigger>
                        <TabsTrigger value="about" className="gap-1.5 rounded-lg text-xs font-semibold">
                            <Info className="h-4 w-4" /> Faahfaahin
                        </TabsTrigger>
                        <TabsTrigger value="location" className="gap-1.5 rounded-lg text-xs font-semibold">
                            <MapPin className="h-4 w-4" /> Goobta
                        </TabsTrigger>
                    </TabsList>

                    {/* 1. Tab-ka Alaabta */}
                    <TabsContent value="products">
                        <ProductGrid products={store.products} onOrder={handleOrder} />
                    </TabsContent>

                    {/* 2. Tab-ka Faahfaahinta */}
                    <TabsContent value="about" className="mt-4">
                        <Card className="rounded-2xl border-border/70 shadow-xs">
                            <CardContent className="p-6">
                                <h3 className="text-base font-bold text-foreground mb-2">Ku Saabsan Ganacsiga</h3>
                                {store.about ? (
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {store.about}
                                    </p>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        Ganacsigaan weli ma soo gelin faahfaahin dheeraad ah.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 3. Tab-ka Goobta (Location & Magaalooyinka) */}
                    <TabsContent value="location" className="mt-4">
                        <Card className="rounded-2xl border-border/70 shadow-xs">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-base font-bold text-foreground">Cinwaanka & Magaalooyinka</h3>
                                {store.location ? (
                                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <span>{store.location}</span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        Goobta gaarka ah (degmada/laamiga) weli lama qeexin.
                                    </p>
                                )}

                                {store.cities && store.cities.length > 0 && (
                                    <div className="pt-2 border-t border-border/60">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
                                            Magaalooyinka aan u adeegno:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {store.cities.map((c: any) => (
                                                <span 
                                                    key={c.id || c.name} 
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 text-xs font-semibold"
                                                >
                                                    <MapPin className="h-3 w-3" />
                                                    {c.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* WhatsApp Checkout Dialog */}
            <OrderModal
                product={selectedProduct}
                storeName={store.name}
                whatsappNumber={store.whatsapp_number}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />

            {/* Powered by Suuqify Footer */}
            <div className="text-center pt-10 pb-4">
                <p className="text-xs text-muted-foreground font-medium">
                    Waxaa ku shaqaynaya{" "}
                    <span className="font-bold text-emerald-600">Suuqify</span>
                </p>
            </div>
        </div>
    );
}