//This gonna be a drop-down for when the user logs in.. 
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getUserSubscriptionPlan } from "../lib/stripe"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import Image from "next/image"

//Passing props, type userAccountNav
interface UserAccountNavProps {

    email: string | undefined
    name: string
    imageUrl: string

}

const UserAccountNav = async ({email, imageUrl, name}: UserAccountNavProps) => {
    const susbcriptionPlan = await getUserSubscriptionPlan()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='overflow-visible'>
                <Button className='rounded-full h-8 w-8 aspect-square bg-slate-400'>
                    {/* We will use an Avatar Component; */}
                    <Avatar className='relative w-8 h-8'>
                        {imageUrl ? (
                            <div className='relative aspect-square h-full w-full'>
                                <Image fill src={imageUrl} alt='profile picture' referrerPolicy='no-referrer'/>

                            </div>

                        ): (
                            //If we don't have an image for this user..  

                        )} 

                        
                    </Avatar>

                </Button>
            </DropdownMenuTrigger>

        </DropdownMenu>
    )

}

export default UserAccountNav