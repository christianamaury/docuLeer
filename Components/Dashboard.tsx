"use client"

//This is a client component; 
//UploadButton would be an entire upload button module, sort of a component;
import { Ghost } from 'lucide-react'
import UploadButton from '../Components/UploadButton'
import {trpc} from '@/app/_trpc/client'
import Skeleton from "react-loading-skeleton"

const Dashboard = () => {
    // return (<div> Hello Sr. </div>)

    //Reference of our getUSerFile Query; Client utility Component
    //Automaticallys knows the endpoint data values;
    const {data: files, isLoading} = trpc.getUserFiles.useQuery()
   
    return (
        <main className='mx-auto max-w-7xl md:p-10'>
            <div className = 'mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
                <h1 className='mb-3 font-bold text-5xl text-gray-900'>
                    Mis Documentos
                </h1>

                <UploadButton/>

            </div>

            {/* Display all users Files */}
            {/* Initial State va a ser: No tienes ningun documento todavia del if else statement*/}
            {files && files?.length !== 0 ? (
                <ul> </ul>
            ) : isLoading ? (
                <Skeleton height={100} className='my-2' count={3}/>

            ) : (
                <div className='mt-16 flex flex-col items-center gap-2'> 
                    <Ghost className = 'h-8 w-8 text-zinc-800' />
                    <h3 className='font-semibold text-xl'> No tienes ningun documento todavia </h3>
                    <p> Sube tu primer documento de PDF! </p>

                </div>
            )}

        </main>
    )
}

export default Dashboard