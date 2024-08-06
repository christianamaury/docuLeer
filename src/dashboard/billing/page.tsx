import BillingForm from "@/app/Components/BillingForm"
import { getUserSubscriptionPlan } from "@/app/lib/stripe"

const Page = async () => {

    const subscriptionPlan = await getUserSubscriptionPlan()

    // Return client Component;
    return <BillingForm subscriptionPlan={subscriptionPlan} />
}

export default Page