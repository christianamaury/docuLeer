import {trpc} from '@/app/_trpc/client'
//Value it's 10 for the infinite query limit;
import {INFINITE_QUERY_LIMIT} from '@/config/infinite-query' 

//Adding Library for icons; 
import { Ghost, MessageSquare, Plus, Trash, Loader2, Send } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import Message from './chat/Message'
 
//Defining MessageProps; 
interface MessagesProps {
    fileId: string

}

const Messages = ({fileId}: MessagesProps) => 
{
    //Destructing from trcp
    //passing an Object;
    const {data, isLoading, fetchNextPage} = trpc.getFileMessages.useInfiniteQuery({
        fileId,
        limit: INFINITE_QUERY_LIMIT,
    }, {

        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        //As we're getting new data; 
        //React Query's useInfiniteQuery implicity keeps previous data when fetching new pages, 
        //so keepPreviousData is not a valid option here;
        // keepPreviousData: true,
        
    })

    //Extracting messages from the Data;
    //flatmap returns one level of array
    const messages = data?.pages.flatMap((page) => page.messages)

    //In format wise, needs to match the original message values;
    const loadingMessage = {

        createdAt: new Date().toString(),
        id: 'loading-message',
        isUserMessage: false, 
        text: (
            <span className='flex h-full items-center justify-center'>
                <Loader2 className='h-4 w-4 animate-spin'></Loader2>

            </span>
        )
    }

    //..Combining...all Messages all Together;
    const combinedMessages = [
        ...(true ? [loadingMessage] : []),
        ...(messages ?? []),
    ]

    //Fetching messages from the database; 
    return <div className='flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-red scrollbar-thumb-rounded scrollbar-track-red-lighter scrollbar-w-2 scrolling-touch'> 
    {/* Mapping for each message */}

    {combinedMessages && combinedMessages.length > 0 ? (

    combinedMessages.map((message, i) => {

        const isNextMessageSamePerson = combinedMessages[i - 1]?.isUserMessage === combinedMessages[i]?.isUserMessage


        //If its the last element 
        if(i === combinedMessages.length - 1){
            return <Message message={message} isNextMessageSamePerson={isNextMessageSamePerson} key={message.id}/>

        }
        //If we're not rendering the last element; 
        else return <Message message={message} isNextMessageSamePerson={isNextMessageSamePerson} key={message.id}/>

    })

    ) : isLoading ? (<div className='w-full flex flex-col gap-2'>
        <Skeleton className='h-16'/>
        <Skeleton className='h-16'/>
        <Skeleton className='h-16'/>
        <Skeleton className='h-16'/>
        <Skeleton className='h-16'/>
        <Skeleton className='h-16'/>
    </div>
    
    
    ) : (<div className='flex-1 flex flex-col items-center justify-center gap-2'> 
            <MessageSquare className='h-8 w-8 text-red-500'/>
            <h3 className='font-semibold text-xl'> Todo ya está listo! </h3>
            <p className='text-zinc-500 text-sm'> 
                Haz tu primera pregunta para comenzar. 
            </p>
    
         </div>
    
    )}

    </div>
}

export default Messages