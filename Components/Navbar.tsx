import MaxWidthWrapper from '../Components/MaxWidthWrapper'
//We would be adding our product logo in the NavBar; 
//In order to use the link anchor feature;
// The following symbol would take the user to the home page: Link '/'
import Link from 'next/link'

const Navbar = () => {

    return (
    <nav className='sticky h-14 inset-x-0-top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
        <MaxWidthWrapper>
            <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                <Link href='/'className='flex z-40 font-semibold'>
                    <span className='text-red-400'> DocuLeer </span>
                </Link>

            </div>

        </MaxWidthWrapper>

    </nav>
    
    )
}

export default Navbar;