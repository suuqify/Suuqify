"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StorefrontData, StorefrontProduct } from "./types";
import { StorefrontHeader } from "./storefront-header";
import { ProductGrid } from "./product-grid";
import { OrderModal } from "./order-modal";
import { Package, Info, MapPin } from "lucide-react";

interface StorefrontViewProps {
    store: StorefrontData;
}

export function StorefrontView({ store }: StorefrontViewProps) {
    const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOrder = (product: StorefrontProduct) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-muted/10 pb-16">
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
                            <Package className="h-4 w-4" /> Alaabta ({store.products.length})
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

                    {/* 2. Tab-ka Faahfaahinta (About Us - Max 1000) */}
                    <TabsContent value="about" className="mt-4">
                        <Card className="rounded-2xl border-border/70 shadow-xs">
                            <CardContent className="p-6">
                                <h3 className="text-base font-bold text-foreground mb-2">Ku Saabsan Dukaanka</h3>
                                {store.about ? (
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {store.about}
                                    </p>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        Dukaankani weli ma soo gelin faahfaahin dheeraad ah.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 3. Tab-ka Goobta (Location) */}
                    <TabsContent value="location" className="mt-4">
                        <Card className="rounded-2xl border-border/70 shadow-xs">
                            <CardContent className="p-6 space-y-3">
                                <h3 className="text-base font-bold text-foreground">Cinwaanka Dukaanka</h3>
                                {store.location ? (
                                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <span>{store.location}</span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        Goobta saxda ah weli lama qeexin.
                                    </p>
                                )}
                                {store.city && (
                                    <p className="text-xs font-medium text-foreground">
                                        Magaalada: <span className="text-primary">{store.city.name}</span>
                                    </p>
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