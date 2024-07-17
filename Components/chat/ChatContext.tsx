//This would consume our components; 
import {ReactNode, createContext, useState, useEffect} from "react";
//Destructive Notifications, Toast, shadcn/ui library; 
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query";

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


const {toast} = useToast();
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