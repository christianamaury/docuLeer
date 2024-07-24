import {trpc} from '@/app/_trpc/client'
//Value it's 10 for the infinite query limit;
import {INFINITE_QUERY_LIMIT} from '@/config/infinite-query' 
 
//Defining MessageProps; 
interface MessagesProps {
    fileId: string

}

const Messages = ({fileId}: MessagesProps) => 
{
    //Destructing from trcp
    //passing an Object;
    const {} = trpc.getFileMessages.useInfiniteQuery({
        fileId,
        limit: INFINITE_QUERY_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        //As we're getting new data; 
        
        

    })

    //Fetching messages from the database; 
    return <div> 

    </div>
}

export default Messages