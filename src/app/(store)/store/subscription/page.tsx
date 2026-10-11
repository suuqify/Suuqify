import { Metadata } from "next";
import { getStoreSubscriptionAction } from "@/actions/store/subscription";
import { SubscriptionView } from "@/components/store/subscription/subscription-view";

export const metadata: Metadata = {
    title: "Heshiiska Ganacsiga (Subscription) | Suuqify",
    description: "La soco xaaladda heshiiskaaga, xadka Boosas ka, iyo muddada kuu hartay.",
};

export default async function SubscriptionPage() {
    const data = await getStoreSubscriptionAction();

    return <SubscriptionView data={data} />;
}