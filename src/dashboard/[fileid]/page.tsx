//[fileid] folder because it would be for the dynamic route; 

//Importing Kindle Session Library; 
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
//redirect library for re-direct navigation purposes; 
import {notFound, redirect} from 'next/navigation'

import {db} from '@/db'

//Importing the PDF Renderer Component; 
import PdfRenderer from '@/app/Components/PdfRenderer'
//Importing Chat Wrapper PDF;
import ChatWrapper from '@/app/Components/ChatWrapper'

//Creating an interface for the PageProps;
//This is a type jsx give us; 
//file object needs to match our folder dynamic route which is fileid
interface PageProps{
    params: {
        fileid: string
    }
}

//Destructure the params and type of values
//Database call
const Page = async ({params} : PageProps) => {
    //Retrieve the file id; 
    //Destructure it from the params; 
    const {fileid} = params

    //Making sure the user is sign in;
    //NEEDS TO BE TEST since isn't using the async (await)
    const {getUser} = await getKindeServerSession()
    const user = await getUser()

    //If true, redirect back to the auth-callback page
    if(!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`)

    //make database call;
    const file = await db.file.findFirst({
        where: {
            id: fileid,
            userId: user.id
        },
    })

    //If there's no file available; Throws a 404 error message found; 
    if(!file) notFound()

    //TESTING
    //3.5rem is to offSet the navBar Height an d100vh full windows heights on Unit
    return (
        <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'> 
            {/* max-w-8x1 needs to be TEST IT */}
            <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
                {/* Left side area of the screen */}
                <div className='flex-1 xl:flex'>
                    <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
                        {/* Custom Component Here, Left Side Sectio, url props that we're fetching from the Database n*/}
                        <PdfRenderer url={file.url}/>
                    </div>
                </div>

                {/* Right Side Section; */}
                <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
                    {/* Custom Component for the Right Side Section*/}
                    {/* Needs to be equal to fileId that we're fetching */}
                        <ChatWrapper fileId={file.id}/>

                </div>
            </div>
        </div>
        )
}

export default Page
