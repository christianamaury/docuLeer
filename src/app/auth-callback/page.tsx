"use client"

//Ensure it's only rendered at a runtime interval;
export const dynamic = "force-dynamic";

//router navigation; 
import {useRouter, useSearchParams} from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'
//Getting the origin dashboard reference for th euser
//This Page automatically once its load to the user

const Page = () => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    // trpc.authCallback.useQuery(undefined, {
    //     onSuccess: ({success}) => {
    //         //If user sync is successfull
    //         //Push user back to 'origin' point if there's an origin path
    //         if(success){
    //             router.push(origin ? `/${origin}` : '/dashboard')
    //         }


    //     },
    //     onError: (err) => {
    //         if(err.data?.code === "UNAUTHORIZED"){
    //             //Pushing user to sign in into the webiste
    //             router.push('/sign-in')
    //         }

    //     }, 
    //     retry: true,
    //     retryDelay: 500
    // })

    //CUSTOM CODE
    const query = trpc.authCallback.useQuery(undefined, {
        retry: true, 
        retryDelay: 500, 

    });
    //Checking if there's any errors in the Results of the Query;
    if(query.error){
        const errData = query.error.data;
        if(errData?.code === 'UNAUTHORIZED'){
            router.push ('/sign-in')

        } else{
            //This would handle any of others errors; 
            console.error("An error has occurred", query.error)
        }

    }
    //If data is succeded, back to the main Dashboard; 
    // if(query.data?.success) 
    if(query.data?.success){
        router.push(origin ? `${origin}` : '/dashboard');

    }

    return (
        <div className='w-full mt-24 flex justify-center'>
            <div className='flex flex-col items-center gap-2'>
              <Loader2 className='h-8 w-8 animate-spin text-zinc-800'/>
              <h3 className='font-semibold text-xl'> Configura tu cuenta..</h3>
                <p>Re-dirigiendo página automaticamente.</p>
            </div>
        </div>
    )

}

export default Page