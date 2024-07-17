import { SendMessageValidator } from '@/app/lib/validators/SendMessageValidator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest } from "next/server";
//Database Model; 
import {db} from '@/db'

//Handliing end API route; 
export const POST = async (req: NextRequest) => {
    //Endpoint route for asking a question to a PDF file; 

    const body = await req.json()

    const {getUser} = await getKindeServerSession();
    const user = await getUser();
    //    const {id: userId} = user

    // Default vauilue is an empty string if user is undefined
    const {id: userId = ""} = user || {};
    if(!userId) 
        return new Response ('Unauthorized', {status: 401})

    const {fileId, message} = SendMessageValidator.parse(body)

    //Finding file from our Database; 
    const file = await db.file.findFirst({
        where: {
            id: fileId, 
            userId,
        },
    })

    if(!file) 
      return new Response ('Not found', {status: 404})

    await db.message.create({
        data: {
            text: message, 
            isUserMessage: true, 
            userId, 
            fileId, 

        }

    })

    //Semantic query from the PDF document; 
    
//    if(!userId) {
//     return new Response ('Unauthorized', {status: 401})

//    }

    // //NEEDS TO BE TESTED IT, 6.42
    // if(!user || user?.id) {
    //     return new Response ('Unauthorized', {status: 401})
    
    //    }


    //   const {id: userId} = user
    //Default vauilue is an empty string if user is undefined
    // const {id: userId = ""} = user || {};
    // if(!userId || user?.id) {
    //     return new Response ('Unauthorized', {status: 401})
    
    //    }
    
//    if(!userId) {
//     return new Response ('Unauthorized', {status: 401})

//    }

    
}
