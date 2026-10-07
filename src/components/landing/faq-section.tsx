import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
    const faqs = [
        {
            q: "Sidee macaamiishu wax iiga iibsanayaan?",
            a: "Macaamiishu waxay booqanayaan link-gaaga Ganacsigaaga (tusaale: suuqify.com/Ganacsigaaga). Marka ay doortaan waxa ay rabaan, waxay gujinayaan 'Dalbo WhatsApp', taas oo toos ugu furaysa WhatsApp-kaaga fariin qoraal ah oo ay ku qoran tahay alaabta ama Adeega ay doonayaan.",
        },
        {
            q: "Sideen ku bixinayaa lacagta Subscription-ka?",
            a: "Waxaad ku bixin kartaa adeegyada lacagaha mobilada ee Soomaalida sida EVC Plus, Zaad, Sahal, iyo eDahab. Markaad lacagta soo dirto waxaad gelinaysaa lambarkaaga aad kasoo dirtay, wax ka yar 1 saac ayuu system ka kugu xaqiijin doona InshaAllah",
        },
        {
            q: "Ma u baahanahay inaan barnaamij-sameeyo (Developer) kireysto?",
            a: "Maya haba yaraatee! Suuqify waxaa loogu talagalay in qof kasta uu 5 daqiiqo gudahood Ganacsi Online ku furto isagoo taleefankiisa gacanta kaliya isticmaalaya.",
        },
        {
            q: "Maxay tahay faa'iidada VIP Plan-ka?",
            a: "Dukaamada qaatay qorshaha Pro VIP waxay si toos ah uga dhex muuqanayaan bogga hore ee website-ka Suuqify (Featured Stores), taas oo kuu keenaysa macaamiil cusub oo dheeraad ah.",
        },
    ];

    return (
        <section className="py-20 bg-muted/20 border-t border-border/60">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">FAQ</span>
                    <h2 className="text-3xl font-extrabold text-foreground mt-2">
                        Su&apos;aalaha Inta Badan La Isweydiiyo
                    </h2>
                </div>

                <Accordion   className="space-y-3">
                    {faqs.map((item, idx) => (
                        <AccordionItem
                            key={idx}
                            value={`item-${idx}`}
                            className="bg-card border border-border/80 rounded-2xl px-5 shadow-2xs"
                        >
                            <AccordionTrigger className="text-sm font-semibold hover:no-underline text-foreground text-left py-4">
                                {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                                {item.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}