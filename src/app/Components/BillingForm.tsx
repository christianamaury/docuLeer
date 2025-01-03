"use client"

import { useToast } from "@/components/ui/use-toast"
import { getUserSubscriptionPlan } from "../lib/stripe"
import { trpc } from "../_trpc/client"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { stat } from "fs"

interface BillingFormProps {

    //Awaited utility type: It check for the getUserSubscriptionPlan
    subscriptionPlan: Awaited<ReturnType <typeof getUserSubscriptionPlan>>
}

//type of billingForm
const BillingForm = ({subscriptionPlan, }: BillingFormProps) => {

    const {toast} = useToast()

    //Alternative page for the pricing page
    //isLoading variable needs to be false
    //Changed the isLoading for status
    //useMutation is a hook function, you can define variables in a configuration Object; 
    const {mutate: createStripeSession, status} = trpc.createStripeSession.useMutation({
        // Destructing url
        onSuccess: ({url}) => {
            if(url) window.location.href = url
            if(!url) {
                // Something went wrong, show notification
                toast({
                    title: "Hubo un problema..", 
                    description: "Por favor intente de nuevo más tarde",
                    variant: "destructive"
                })
            }
        },
    })

    const isLoading = status === "pending";
    
    return <MaxWidthWrapper className='max-w-5xl'>

        <form className='mt-12' onSubmit={(e) => {
            // Prevent Default Submission of the Form
            e.preventDefault()
            createStripeSession()

        }}>  
            {/* shadcn dependency card */}

            <Card>
                <CardHeader>
                    <CardTitle>
                        Subscription Plan
                    </CardTitle>

                    <CardDescription>
                        {/* Showing on what subscription play they're in currently; */}
                        You are currently on the <strong>{subscriptionPlan.name}</strong> plan. 

                    </CardDescription>

                </CardHeader>

            <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>

                <Button type='submit'>

                    {/* Passing it as a prop conditional */}
                    {isLoading ? (
                        <Loader2 className='mr-4 h-4 w-4 animate-spin'/>
                    ) : null}

                    {subscriptionPlan.isSubscribed ? "Managed Subscription" : "Upgrade to PRO" }

                </Button>

                {/* We would like to display down here when this plan gets cancel */}
                {subscriptionPlan.isSubscribed ? (

                    <p className='rounded-full text-xs font-medium'>
                        {subscriptionPlan.isCanceled ? "Your plan will be cancel on " : "Your plan renews on"}
                        {/* ! for the force unwrap */}
                        {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}.
                    </p>
                ) : null}

            </CardFooter>

            </Card>
        
        </form>

    </MaxWidthWrapper>
}

export default BillingForm