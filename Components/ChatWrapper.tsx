
//This is a Client Component

"use client"

//Handle all Chat loading logic; 
//Importing Message Component; 
import Message from "@/app/Components/Message" 

//Importing ChatInput Component; 
import ChatInput from "@/app/Components/chat/ChatInput"

import {trpc} from "@/app/_trpc/client"

//From the React Library; 
import {Loader2, XCircle, ChevronLeft}  from 'lucide-react'
import { UploadStatus } from '@prisma/client';
import { buttonVariants } from "@/components/ui/button"

// The following symbol would take the user to the home page: Link '/'
import Link from 'next/link'

interface ChatWrapperProps {
    fileId: string 

}

const ChatWrapper = ({fileId}: ChatWrapperProps) => {

    //It seems that this Data is on a Deeper Nested Object
    //To access the status variable: data?.state?.data?.status instead data?.status
    const {data, isLoading} = trpc.getFileUploadStatus.useQuery({
        fileId, 
    }, {
     refetchInterval: (data) => 
     data?.state.data?.status === 'SUCCESS' || data?.state.data?.status === 'PENDING' ? false : 500,
    
    })

    //If isLoading variable is True; 
    if(isLoading) return (
        <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'> 
            <div className='flex-1 flex justify-center items-center flex-col mb-28'>
                <div className='flex flex-col items-center gap-2'> 
                    <Loader2 className='h-8 w-8 text-red-500 animate-spin'/>
                    <h3 className='font-semibold text-xl'> Subiendo.. </h3>
                    <p className='text-zinc-500 text-sm'>
                        Estamos preparando tu documento PDF.
                    </p>
                </div>
            </div>

            {/* Chat Input Component, Passing Boolean*/}
            <ChatInput isDisabled/>

        </div>
    )

    //Handling the proccessing state;
    //Data from the query: data?.status
    if(data?.status === 'PROCESSING') return (

        <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'> 
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
            <div className='flex flex-col items-center gap-2'> 
                <Loader2 className='h-8 w-8 text-red-500 animate-spin'/>
                <h3 className='font-semibold text-xl'> Procesando tu documento PDF.. </h3>
                <p className='text-zinc-500 text-sm'>
                    Esto no tomara tanto tiempo. 
                </p>
            </div>
        </div>

        {/* Chat Input Component, Passing Boolean*/}
        <ChatInput isDisabled/>

    </div>
    )

    //If its a free user they shouldn't be able to upload PDF more than 5MB; 
    //Handling Failed State; 
    if(data?.status === 'FAILED') return (

        <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'> 
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
            <div className='flex flex-col items-center gap-2'> 
                <XCircle className='h-8 w-8 text-red-500'/>
                <h3 className='font-semibold text-xl'> Demasiadas paginas dentro de tu documento PDF.. </h3>
                <p className='text-zinc-500 text-sm'>
                    Tu <span className='font-medium'> cuenta gratis </span> solo permite hasta 5 paginas dentro del PDF.
                </p>

                {/* An option for the user to go back to the main menu */}
                <Link href='/dashboard' className={buttonVariants({
                    variant: "secondary", 
                    className: "mt-4", 
                })}>  
                <ChevronLeft className='h-3 w-3 mr-1.5'/> De vuelta </Link>
            </div>
        </div>

        {/* Chat Input Component, Passing Boolean*/}
        <ChatInput isDisabled/>

    </div>
    )

    return (
    <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'> 
        <div className='flex-1 justify-between flex flex-col mb-28'>

        {/* Message Component */}
        <Message/>

        </div>

         {/* Chat Input Component */}
        <ChatInput/>
    </div>
    
    )
}

export default ChatWrapper