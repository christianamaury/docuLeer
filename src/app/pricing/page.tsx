import MaxWidthWrapper from "@/app/Components/MaxWidthWrapper";
import UpgradeButton from "../Components/UpgradeButton";
import { buttonVariants } from "@/components/ui/button";
import { TooltipProvider, TooltipContent, Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import Link from "next/link";

const Page = async () => {

    //Destructing if the user whether is signed into their account or not; 
    const {getUser} = await getKindeServerSession();
    const user = await getUser();

    //Stripe purposes Configuration;  
    const pricingItems = [
        {
          plan: 'Free',
          tagline: 'For small side projects.',
          quota: 10,
          features: [
            {
              text: '5 pages per PDF',
              footnote: 'The maximum amount of pages per PDF-file.',
            },
            {
              text: '4MB file size limit',
              footnote: 'The maximum file size of a single PDF file.',
            },
            {
              text: 'Mobile-friendly interface',
            },
            {
              text: 'Higher-quality responses',
              footnote: 'Better algorithmic responses for enhanced content quality',
              negative: true,
            },
            {
              text: 'Priority support',
              negative: true,
            },
          ],
        },
        {
          plan: 'Pro',
          tagline: 'For larger projects with higher needs.',
          quota: PLANS.find((p) => p.slug === 'pro')!.quota,
          features: [
            {
              text: '25 pages per PDF',
              footnote: 'The maximum amount of pages per PDF-file.',
            },
            {
              text: '16MB file size limit',
              footnote: 'The maximum file size of a single PDF file.',
            },
            {
              text: 'Mobile-friendly interface',
            },
            {
              text: 'Higher-quality responses',
              footnote: 'Better algorithmic responses for enhanced content quality',
            },
            {
              text: 'Priority support',
            },
          ],
        },
      ]

    return (
        <>  
            <MaxWidthWrapper className='mb-8 mt-24 text-center max-w-5xl'>
                <div className='mx-auto mb-10 sm:max-w-lg'>
                    <h1 className='text-6xl font-bold sm:text-7xl'>
                        Precios
                    </h1>
                    <p className='mt-5 text-gray-600 sm:text-lg'>
                        Utiliza el servicio que te parezca mas conveniente, según a tus necesidades.
                    </p>
                </div>

                {/* Actual content of the Page */}
                <div className='pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2'>
                    <TooltipProvider>

                        {/* Using <> </> to dissapear children error message */}
                            {
                                // Mapping through the pricingItems;
                                //Destructing plan, tagline, quota, features
                                pricingItems.map(({plan, tagline, quota, features}) => {
                                    // Finding out the price
                                    const price = PLANS.find((p) => p.slug === plan.toLocaleLowerCase())?.price.amount || 0

                                    // Returning a Div element;
                                   return <div key={plan} className={cn("relative rounded-2xl bg-white shadow-lg", {
                                    "border-2 border-red-600 shadow-red-200": plan === "Pro",
                                    "border border-gray-200": plan !== "Pro"

                                   })}> 
                                        {
                                            plan == "Pro" && (
                                                <div className='absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-red-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white '> 
                                                    Actualiza al Pro plan ahora! 
                                                </div>
                                            )
                                        }

                                        <div className='p-5'>
                                            <h3 className='my-3 text-center font-display text-3xl font-bold'>
                                                {plan}
                                            </h3>

                                            <p className='text-gray-500'>
                                                {tagline}
                                            </p>

                                            <p className='my-5 font-display text-6xl font-semibold'>
                                                ${price}
                                            </p>

                                            <p className='text-gray-500'>
                                                mensualmente
                                            </p>

                                        </div>

                                        <div className='flex h-20 items-center justify-center border border-b border-t border-gray-200 bg-gray-50'>
                                            <div className='flex items-center space-x-1'>
                                                <p>
                                                    {/* Converting numeric value to Local String; */}
                                                    {quota.toLocaleString()} archivos de PDFs por cada mes. 
                                                </p>

                                                {/* A 300 seconds delay for the trigger */}
                                                <Tooltip delayDuration={300}>
                                                  <TooltipTrigger className='cursor-default ml-1.5'>
                                                    {/* Lucide HelpCircle icon */}
                                                    <HelpCircle className='h-4 w-4 text-zinc-500'/>
                                                  </TooltipTrigger>
                                                    <TooltipContent className='w-80 p-2'>
                                                        {/* Once the user hove on top the icon, it would explaining for them; */}
                                                            La cantidad de documentos PDFs que puedes subir por mes.
                                                    </TooltipContent>

                                                </Tooltip>

                                            </div>
                                        </div>

                                        <ul className='my-10 space-y-5 px-8'>
                                            {/* mapping through the Features  */}
                                            {features.map(({text, footnote, negative}) => (
                                                <li key={text} className='flex space-x-5'> 
                                                    <div className='flex-shrink-0'>
                                                        {negative ? (
                                                            <Minus className='h-6 w-6 text-gray-300'/>
                                                        ) : (
                                                            <Check className='h-6 w-6 text-red-500'/>
                                                        )}
                                                    </div>

                                                    {/* Checking to see if we actually have a Footnote; */}
                                                    {footnote ? (
                                                        <div className='flex items-center space-x-1'>
                                                            <p className={cn("text-gray-400", {
                                                                'text-gray-600':
                                                                negative, 

                                                              })}>
                                                                {/* Rendering the text; */}
                                                                {text}
                                                            </p>

                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger className='cursor-default ml-1.5'>
                                                                    {/* Lucide HelpCircle icon */}
                                                                    <HelpCircle className='h-4 w-4 text-zinc-500'/>
                                                                </TooltipTrigger>
                                                                    <TooltipContent className='w-80 p-2'>
                                                                        {/* Once the user hove on top the icon, it would explaining for them; */}
                                                                        {footnote}
                                                                    </TooltipContent>
                                                            </Tooltip>

                                                        </div>
                                                    ) : (  
                                    
                                                        <p className={cn("text-gray-400", {
                                                        'text-gray-600':
                                                        negative, 

                                                      })}>
                                                        {/* Rendering the text; */}
                                                        {text}
                                                    </p>
                                                    )}
                                                
                                                </li>
                                            ))}

                                        </ul>

                                        <div className='border-t border-gray-200'/>
                                            <div className='p-5'>
                                                {/* Conditional Checking; */}
                                                {plan === "Free" ? (

                                                    <Link href={user ? '/dashboard': '/sign-in'} className={buttonVariants({
                                                        className: 'w-full',
                                                        variant: 'secondary',
                                                    })}>
                                                        {/* If we have an user, inside the button: upgrade now. Previously it could be Upgrade Now or Sign Up */}
                                                        {user ? "Actualiza tu cuenta ahora" : "Registrate Ahora"}
                                                        <ArrowRight className='h-5 w-5 ml-1.5'/>

                                                    </Link>

                                                ) : user ? (
                                                    //If there's an user, there would be a button to upgrade
                                                    // Adding custom Upgrade Component;
                                                    <UpgradeButton/>

                                                ) : (
                                                    <Link href='/sign-in' className={buttonVariants({
                                                        className: 'w-full'
                                                    })}>
                                                        {/* If we have an user, inside the button: upgrade now. Previously it could be Upgrade Now or Sign Up */}
                                                        {user ? "Actualiza tu cuenta ahora" : "Registrate Ahora"}
                                                        <ArrowRight className='h-5 w-5 ml-1.5'/>

                                                    </Link>
                                                )}
                                             </div>

                                   </div>

                                })

                            }
                      
                    </TooltipProvider>

                </div>
            </MaxWidthWrapper>
        </>
    )

}

export default Page