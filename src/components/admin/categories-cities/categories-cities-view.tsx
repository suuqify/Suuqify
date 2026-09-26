"use client";

import React, { useState, useTransition } from "react";
import { TaxonomyItem } from "@/actions/admin/categories-cities";
import {
    createCategoryAction,
    updateCategoryAction,
    toggleCategoryActiveAction,
    deleteCategoryAction,
    createCityAction,
    updateCityAction,
    toggleCityActiveAction,
    deleteCityAction,
} from "@/actions/admin/categories-cities";
import { TaxonomyDialog } from "./categories-cities-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Tag, MapPin } from "lucide-react";

interface TaxonomyViewProps {
    categories: TaxonomyItem[];
    cities: TaxonomyItem[];
}

export function TaxonomyView({ categories, cities }: TaxonomyViewProps) {
    const [activeTab, setActiveTab] = useState<"category" | "city">("category");
    const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleOpenAdd = () => {
        setSelectedItem(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = (item: TaxonomyItem) => {
        setSelectedItem({ id: item.id, name: item.name });
        setDialogOpen(true);
    };

    const handleToggleStatus = (item: TaxonomyItem) => {
        startTransition(async () => {
            const res =
                activeTab === "category"
                    ? await toggleCategoryActiveAction(item.id, item.is_active)
                    : await toggleCityActiveAction(item.id, item.is_active);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    const handleDelete = (item: TaxonomyItem) => {
        if (confirm(`Ma hubtaa inaad tirtirto "${item.name}"?`)) {
            startTransition(async () => {
                const res =
                    activeTab === "category"
                        ? await deleteCategoryAction(item.id)
                        : await deleteCityAction(item.id);
                if (res.success) toast.success(res.message);
                else toast.error(res.error);
            });
        }
    };

    const handleDialogSubmit = async (name: string, id?: string) => {
        if (activeTab === "category") {
            return id ? await updateCategoryAction(id, name) : await createCategoryAction(name);
        } else {
            return id ? await updateCityAction(id, name) : await createCityAction(name);
        }
    };

    const renderTable = (items: TaxonomyItem[]) => (
        <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden mt-4">
            {items.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                    Waxba lagama helin halkan.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/60">
                            <tr>
                                <th className="py-3 px-4 font-medium">Magaca</th>
                                <th className="py-3 px-4 font-medium">Dukaamada Ku Xiran</th>
                                <th className="py-3 px-4 font-medium">Xaaladda</th>
                                <th className="py-3 px-4 font-medium text-right">Ficil</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-3.5 px-4 font-semibold text-foreground">{item.name}</td>
                                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                                        <Badge variant="secondary" className="font-normal text-xs">
                                            {item.stores_count || 0} Dukaamo
                                        </Badge>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={item.is_active}
                                                onCheckedChange={() => handleToggleStatus(item)}
                                                disabled={isPending}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {item.is_active ? "Shidan" : "Damsan"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenEdit(item)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={isPending}
                                                onClick={() => handleDelete(item)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 rounded-lg"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Qaybaha & Magaalooyinka
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Maamul qaybaha ganacsiga iyo magaalooyinka dukaamadu doortaan marka ay is-diiwaangelinayaan.
                    </p>
                </div>
                <Button
                    onClick={handleOpenAdd}
                    className="rounded-xl text-xs font-semibold bg-primary text-primary-foreground gap-1.5 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Ku Dar {activeTab === "category" ? "Qayb" : "Magaalo"}</span>
                </Button>
            </div>

            {/* shadcn Tabs */}
            <Tabs
                defaultValue="category"
                onValueChange={(val) => setActiveTab(val as "category" | "city")}
            >
                <TabsList className="bg-muted p-1 rounded-xl">
                    <TabsTrigger value="category" className="rounded-lg text-xs gap-1.5 font-semibold">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Qaybaha Ganacsiga ({categories.length})</span>
                    </TabsTrigger>
                    <TabsTrigger value="city" className="rounded-lg text-xs gap-1.5 font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Magaalooyinka ({cities.length})</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="category">
                    {renderTable(categories)}
                </TabsContent>

                <TabsContent value="city">
                    {renderTable(cities)}
                </TabsContent>
            </Tabs>

            <TaxonomyDialog
                type={activeTab}
                item={selectedItem}
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmitAction={handleDialogSubmit}
            />
        </div>
    );
}