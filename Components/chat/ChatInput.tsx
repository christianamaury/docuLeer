
import { Button } from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
//Adding Library for icons; 
import { Ghost, MessageSquare, Plus, Trash, Loader2, Send } from 'lucide-react'
import { useContext } from "react"
import { ChatContext } from "./ChatContext"

//It takes a props property
//Destructing Props
interface ChatInputProps{
    isDisabled?: boolean
}

//Modified the Textarea Component in order to use the maxRows{} props;
const ChatInput = ({isDisabled}: ChatInputProps) => {

//Destructing from our ChatContext
//Accepts a Context Object and returns the current Context Value;
const {addMessage, handleInputChange, isLoading, message, } = useContext (ChatContext)

    return (
    <div className='absolute bottom-0 left-0 w-full'>
        <form className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
            <div className='relative flex h-full flex-1 items-stretch md:flex-col'> 
                <div className='relative flex flex-col w-full flex-grow p-4'>
                    <div className='relative'>
                        <Textarea rows={1} maxRows={4} autoFocus onKeyDown={(e) => {
                         if(e.key === "Enter" && !e.shiftKey){
                            e.preventDefault()

                            addMessage()
                         }
                            
                        }} placeholder='Ingresa tu pregunta..' className='resize-none pr-12 text-base py-3 scrollbar-thumb-red scrollbar-thumb-rounded scrollbar-track-red-lighter scrollbar-w-2 scrolling-touch' /> 
                   
                         <Button className='absolute bottom-1.5 right-[8px]' aria-label = 'send message'> 
                           <Send className='h-4 w-4'/>
                         </Button>
                   
                    </div>
                </div>
            </div>
        </form>
    </div>
    )
}

export default ChatInput