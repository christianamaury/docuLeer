import { buttonVariants } from '@/components/ui/button';
import MaxWidthWrapper from '../Components/MaxWidthWrapper'
//We would be adding our product logo in the NavBar; 
//In order to use the link anchor feature;
// The following symbol would take the user to the home page: Link '/'
import Link from 'next/link'

//Importing icon react library
import {ArrowRight} from "lucide-react"

//You need to import the LoginLink framework in order to use this class; 
import {LoginLink, RegisterLink} from '@kinde-oss/kinde-auth-nextjs/server'

const Navbar = () => {

    return (
    <nav className='sticky h-14 inset-x-0-top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
        <MaxWidthWrapper>
            <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                <Link href='/'className='flex z-40 font-semibold'>
                    <span className='text-red-400'> DocuLeer </span>
                </Link>

                {/* Mobile Navigation */}

                <div className='hidden items-center space-x-4 sm:flex'>
                    <>
                        <Link href= '/pricing' className={buttonVariants({
                            variant: "ghost",
                            size: 'sm',

                        })}> Pricing 
                        </Link>
                        <LoginLink className={buttonVariants({
                            variant: "ghost",
                            size: 'sm',

                        })}>
                            Accede tu Cuenta
                        </LoginLink>

                        <RegisterLink className={buttonVariants({
                            size: 'sm',

                        })}>
                            Registrate <ArrowRight className='ml-1.5 h-5 w-5'/>
                        </RegisterLink>
                    
                    </>

                </div>

            </div>

        </MaxWidthWrapper>

    </nav>
    
    )
}

export default Navbar;