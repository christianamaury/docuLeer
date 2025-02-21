//This a use cllient Component; 
"use client"

//importing the useState Library from React; 
import {PropsWithChildren, useState} from "react"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
//const 'trpcClient 'wrapper for the React Queries; 
import {trpc} from "@/app/_trpc/client"
import { httpBatchLink } from "@trpc/client"
import { absoluteUrl } from "@/lib/utils"

//PropsWithChildren comes from React;

const Providers = ({children}: PropsWithChildren) => {
   const [queryClient] = useState(() => new QueryClient())
   const [trpcClient] = useState(() => trpc.createClient({
        links:[
            //There's no local host when we deploy to Production: http://localhost:3000/api/trpc
            httpBatchLink({
                url: absoluteUrl("/api/trpc"),
            }),
        ],

   })) 

   return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
    </trpc.Provider>
   )

}

export default Providers