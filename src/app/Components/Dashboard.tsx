"use client"

//This is a client component; 
//UploadButton would be an entire upload button module, sort of a component;
//Adding Library for icons; 
import { Ghost, MessageSquare, Plus, Trash, Loader2 } from 'lucide-react'
import {useState} from 'react'
import UploadButton from '../Components/UploadButton'
import {trpc} from '@/app/_trpc/client'
import Skeleton from "react-loading-skeleton"
// The following symbol would take the user to the home page: Link '/'
import Link from 'next/link'

//Utility Dependency for the formatting timezone
//Expected 2 to 3 arguments on the function;
//"MMM yyyy" = Month & Year Reference; 
import {format} from "date-fns"
import { Button } from '@/components/ui/button'
import { getUserSubscriptionPlan } from '../lib/stripe'

//Everytime that we map over something, we need a: key;
//This color on the mapping area needs to be updated: from-cyan-500 to-blue-500(Just for Testing)

interface PageProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const Dashboard = ({subscriptionPlan}: PageProps) => {
    // return (<div> Hello Sr. </div>)

    //In order to check which file is being deleted it. 
    //It would be a string or null value; Default value = null
    const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string | null> (null)

    //Validate to enforce to refresh the data right at the moment; 
    //TEST SINCE useContext has depreceated it;
    const utils = trpc.useContext()

    //Reference of our getUSerFile Query; Client utility Component
    //Automaticallys knows the endpoint data values;
    const {data: files, isLoading} = trpc.getUserFiles.useQuery()

    //Destructing from trcp router to the Front-End, index.ts trpc; 
    //Renaming mutate to delete files
    //onSuccess callback might have depreceated; 
    const {mutate: deleteFile} = trpc.deleteFile.useMutation({

        //THIS LINE NEEDS TO BE TESTED IT; 
        onSuccess: () => {
                //Endpoint that we would like to address..
                utils.getUserFiles.invalidate()
        }, 

        //Whenever we click the button right away;
        //Basically currently deleting this id object; 
        onMutate({id}){
            setCurrentlyDeletingFile(id)
        }, 

        //When an error is throw; we're not deleting anything yet; 
        onSettled(){
            setCurrentlyDeletingFile(null)
        }
        
    })

   
    return (
        <main className='mx-auto max-w-7xl md:p-10'>
            <div className = 'mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
                <h1 className='mb-3 font-bold text-5xl text-gray-900'>
                    Mis Documentos
                </h1>

                <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />

            </div>
            
            {/* Display all users Files */}
            {/* Initial State va a ser: No tienes ningun documento todavia del if else statement*/}
            {files && files?.length !== 0 ? (
                <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3"> 
                {/* Sorting Files for the users */}
                    {files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((file) => (
                    
                        <li key={file.id} className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'>
                            <Link href={`/dashboard/${file.id}`} className='flex flex-col gap-2'>      
                                <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500'> </div>
                                    <div className='flex-1 truncate'> 
                                        <div className='flex items-center space-x-3'>
                                            <h3 className='truncate text-lg font-medium text-zinc-900'> 
                                             {file.name} 
                                            </h3>
                                        </div>  
                                    </div>
                                </div>
                            </Link>
                            
                            {/* When the file was uploaded, basically when it was created;*/}
                            <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500'>
                                <div className = 'flex items-center gap-2'>
                                    <Plus className='h-4 w-4'/>
                                        {format(new Date(file.createdAt), "MMM yyyy")}
                                </div>

                                <div className='flex items-center gap-2'>
                                    <MessageSquare className='h-4 w-4'/>
                                    testing Reference
                                </div>

                                {/* Trash Icon Button to delete the files from the Dashboard, variant variable destructive to make it color red. onClick file.id object that we're mapping to delete */}
                                <Button onClick={() => deleteFile({id:file.id})} size='sm' className='w-full' variant= 'destructive'>
                                    {/* If it is true, show the loading state  */}
                                    {currentlyDeletingFile === file.id ? (<Loader2 className='h-4 w-4 animate-spin'/>) : (<Trash className='h-4 w-4'/>)}
                                </Button>

                            </div>
                        </li>
                    ))}
                
                </ul>
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