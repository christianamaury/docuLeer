//This gonna be a drop-down for when the user logs in.. 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getUserSubscriptionPlan } from "../lib/stripe"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { Icons } from "./Icons"
import Link from "next/link"
import { Gem } from "lucide-react"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"

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

                        ): 
                            //If we don't have an image for this user..  
                            <AvatarFallback>
                                {/* Screen Readers would be able to see the name */}
                                <span className='sr-only'>
                                    {name}
                                    <Icons.user className='h-4 w-4 text-zinc-900'/>
                                </span>
                                
                            </AvatarFallback>
                        } 
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

           
            <DropdownMenuContent className='bg-white' align='end'>
                        <div className='flex items-center justify-start gap-2 p-2'>
                            <div className='flex flex-col space-y-0.5 leading-none'>
                                {/* If we have a name here, we would be rending */}
                                {name && <p className='font-medium text-sm text-black'> {name} </p>}
                                
                                {/* Checking if we have an email..  */}
                                {email && (
                                <p className='w-[200px] truncate text-xs text-zinc-700'>
                                    {email}
                                </p>
                                
                                )}

                            </div>

                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href='/dashboard'> Dashboard </Link>

                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            {/* For the actual content we're doing a Conditional Check;  */}
                            {susbcriptionPlan?.isSubscribed ? (
                                <Link href='/dashboard/billing'> Maneja tu cuenta </Link>
                            ): (
                                <Link href='/pricing'> Plan Pro <Gem className='text-red-600 h-4 w-4 ml-1.5'/> </Link>
                            )}

                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className='cursor-pointer'>
                            {/* We this method from Kinde Session*/}
                             <LogoutLink> Cerrar Sesión </LogoutLink>

                        </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    )

}

export default UserAccountNav