"use client"

//router navigation; 
import {useRouter, useSearchParams} from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'
//Getting the origin dashboard reference for th euser
//This Page automatically once its load to the user

const Page = () => {

    const router = useRouter()

    const searchParams = useSearchParams()
    const origin = searchParams.get('orgin')

    // const apiResponse = await fetch('/api/whatever')
    
    // const data = await apiResponse.json()

    // const {data} = trpc.test.useQuery
    // const {data, isLoading} = trpc.test.useQuery()
    trpc.authCallback.useQuery(undefined, {
        onSuccess: ({success}) => {
            //If user sync is successfull
            //Push user back to 'origin' point if there's an origin path
            if(success){
                router.push(origin ? `/${origin}` : `/dashboard`)
            }


        },
        onError: (err) => {
            if(err.data?.code === "UNAUTHORIZED"){
                //Pushing user to sign in into the webiste
                router.push("/sign-in")
            }

        }, 
        retry: true,
        retryDelay: 500
    })

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