import { Metadata } from "next";
import { ShoppingBag, Target, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Nagu Saabsan (About Us) | Suuqify",
    description: "Baro ujeeddada iyo himilada ka dambaysa dhismaha Suuqify.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 py-16 sm:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-2">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                            Ku Saabsan Suuqify
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Waxaan u dhisnay Suuqify si aan u awood-siinno ganacsatada Soomaaliyeed ee wax ku iibiya baraha bulshada.
                        </p>
                    </div>

                    {/* Story Card */}
                    <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-5 leading-relaxed text-sm sm:text-base text-foreground/85">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Qisada Suuqify</h2>
                        <p>
                            Boqolaal dhalinyaro Soomaali ah ayaa maalin kasta alaab ku soo bandhiga TikTok, Instagram, iyo Facebook. Laakiin habka ay wax u iibiyaan wuxuu ahaa mid dhib badan: macaamiisha oo DM-ka buuxiya, qiimaha oo mar kasta la isweydiiyo, iyo dalabyada oo luma.
                        </p>
                        <p>
                            Website-yada waaweyn sida Shopify aad bay ugu adkaayeen ganacsatada maxalliga ah sababo la xiriira qaab-dhismeedka lacag-bixinta caalamiga ah (Stripe / PayPal) oo aan Soomaaliya ka shaqayn.
                        </p>
                        <p>
                            Sidaas darteed waxaan dhisnay <strong>Suuqify</strong>: madal Link-in-Bio ah oo aad u fudud, ku shaqaynaysa lacagaha mobilada ee dalka (EVC Plus, Zaad, Sahal), dalabkuna uu toos WhatsApp ugu yimaado fariin diyaarsan oo kooban.
                        </p>
                    </div>

                    {/* Pillars */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-muted/30 border border-border/80 rounded-2xl p-6 text-center space-y-2">
                            <Target className="w-6 h-6 text-primary mx-auto" />
                            <h3 className="font-bold text-foreground text-sm">Hadafkeenna</h3>
                            <p className="text-xs text-muted-foreground">In qof kasta oo ganacsade ah uu ku yeesho dukaan casri ah 60 ilbiriqsi gudahood.</p>
                        </div>
                        <div className="bg-muted/30 border border-border/80 rounded-2xl p-6 text-center space-y-2">
                            <Zap className="w-6 h-6 text-primary mx-auto" />
                            <h3 className="font-bold text-foreground text-sm">Fududeynta Iibka</h3>
                            <p className="text-xs text-muted-foreground">Meesha ka saarista nidaamyada lacag-bixineed ee murugsan iyadoo toos WhatsApp loo adeegsanayo.</p>
                        </div>
                        <div className="bg-muted/30 border border-border/80 rounded-2xl p-6 text-center space-y-2">
                            <Users className="w-6 h-6 text-primary mx-auto" />
                            <h3 className="font-bold text-foreground text-sm">Taageerada Maxalliga</h3>
                            <p className="text-xs text-muted-foreground">Taageero toos ah oo ku hadasha luuqadda Soomaaliga lana socota baahida ganacsiga dalka.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}