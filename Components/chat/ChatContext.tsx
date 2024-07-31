//This would consume our components; 
import {ReactNode, createContext, useState, useEffect, useRef} from "react";
//Destructive Notifications, Toast, shadcn/ui library; 
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { map } from "zod";

//Type of what we want the ChatContext to be; 
type StreamResponse = {

       //Function to add a Message; returns void
       addMessage: () => void,
       message: string,
       handleInputChange: (event: React.ChangeEvent <HTMLTextAreaElement>) => void, 
       isLoading: boolean, 
} 

export const ChatContext = createContext<StreamResponse>({

    //Function to add a Message; 
    addMessage: () => {},
    message:'',
    handleInputChange: () => {}, 
    isLoading: false, 

})

//fileId and Child props
//ReactNode represents everything that can be rendered
interface Props {
    fileId: string,
    children: ReactNode
}

//Wrapping interface Props on the Component; 
export const ChatContextProvider = ({fileId, children}: Props) => {

const [message, setMessage] = useState<string>('')
const [isLoading, setIsLoading] = useState<boolean>(false)

//For Optimistic Update purposes; 
const utils = trpc.useContext()

const {toast} = useToast();

const backupMessage = useRef('')

//API route;
//Destructing the Function; 
const {mutate: sendMessage} = useMutation({

    mutationFn: async ({message}: {message: string}) => {
        const response = await fetch('/api/message', {
            method: 'POST', 
            body: JSON.stringify({
                fileId, 
                message, 
            }),
        })
        if(!response.ok){
            throw new Error ("Hubo un error mandando el mensaje")
        }

        return response.body

    },

    onMutate: async ({message}) => {
        //Creating backup of the messages for inmediate feedback
        backupMessage.current = message
        setMessage('')

        //Canceling any outgoing refresh it;
        await utils.getFileMessages.cancel()

        //snapshot previous value that we had..
        const previousMessages = utils.getFileMessages.getInfiniteData()

        //Optimistically insert the new value; 
        utils.getFileMessages.setInfiniteData({fileId, limit: INFINITE_QUERY_LIMIT}, 
            (old) => {
                //If there's no old data
                if(!old){
                   return {
                    pages: [],
                    pageParams: []
                   }
                }
                
                let newPages = [...old.pages]

                let latestPages = newPages[0]!

                latestPages.messages = [
                    {
                        createdAt: new Date().toISOString(), 
                        id: crypto.randomUUID(),
                        text: message, 
                        isUserMessage: true
                    }, 
                    ...latestPages.messages
                ]

                //Changing the Data  
                newPages[0] = latestPages   

                return {
                    ...old, 
                    //overriding pages with the new ones;
                    pages: newPages,
                }
            }     
      )

            setIsLoading(true)

            //returning previous ;
            return {
                previousMessages: previousMessages?.pages.flatMap((page) => page.messages) ?? [],
            }
    },

    //Receiving string variable: stream
    onSuccess: async (stream) => {

        setIsLoading(false)

        if(!stream){
        //Returning Toast notification for the user;
        return toast({
            title: "Hubo un problema enviando este mensaje.",
            description: "Por favor, haga refresh a la página y intente de nuevo.",
            variant: "destructive"
            })
        }
            //Reading context of it;
            //Decodng it
            const reader = stream.getReader()
            const decoder = new TextDecoder()
            let done = false

            //Initializing accumulative response; 
            //Empty string by Default;
            let accResponse = ''

            while(!done){
                //Reading stram
                const {value, done: doneReading} = await reader.read()
                done = doneReading

                //Getting string context
                const chunkValue = decoder.decode(value)

                accResponse += chunkValue

                //Append the chunk variabl.e to the actual game; 
                //Destruct the fileId;
                utils.getFileMessages.setInfiniteData(
                    {fileId, limit: INFINITE_QUERY_LIMIT},
                    (old) => {
                        if(!old) return {pages: [], pageParams: []}

                        //Returns a Boolean;
                        //For each page in the Old Data;
                        let isAiResponseCreated = old.pages.some((page) => page.messages.some((message) => message.id === "ai-response"))

                        let updatedPages = old.pages.map((page) => {
                            if(page === old.pages[0]) {
                                let updatedMessages

                                if(!isAiResponseCreated){
                                    updatedMessages = [
                                        {
                                            createdAt: new Date().toISOString(),
                                            // This gonna be the hardcoded AI response;
                                            id: "ai-response",
                                            text: accResponse,
                                            isUserMessage: false
                                        },
                                        ...page.messages
                                    ]
                                } else {
                                    // Adding if there's already an AI response; 
                                    updatedMessages = page.messages.map((message) => {
                                        if(message.id === "ai-response") {
                                            return {
                                                // Returning message properties that were there before;
                                                ...message, 
                                                text: accResponse
                                            }
                                        }

                                        return message
                                    })

                                }
                                // Returning an Object;
                                return {
                                    ...page, 
                                    messages: updatedMessages
                                }

                            }
                            return page
                        })

                        // overriting old messages with newMessages; 
                        return { ...old, pages: updatedPages}

                    }
                )
            }
    },

    //We dont want 1st or either 2nd arguments, just the 3rd one;
    onError: (_, __, context) => {
        setMessage(backupMessage.current)
        utils.getFileMessages.setData(
            {fileId},
            {messages: context?.previousMessages ?? []}
        )
    },

    onSettled: async () => {
        //We refresh the entire Data; 
        setIsLoading(false)

        await utils.getFileMessages.invalidate({
            fileId
        })
    },
})

//Handling input Changes; 
//It receives an event; 
const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

    //Setting the message to the e
    setMessage(e.target.value)
}

const addMessage = () => sendMessage({message})

    return (
        <ChatContext.Provider value={{
                addMessage, 
                message, 
                handleInputChange,
                isLoading, 
        }}>

            {children}
        </ChatContext.Provider>
    )
 
}