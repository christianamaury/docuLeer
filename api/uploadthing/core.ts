
//Component to upload Files once the user has been verified as a member.

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

//Library for the User Login verification;
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
 
const f = createUploadthing();
 
// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  // MaxFile can be increased if the user is a pro user
  pdfUploader: f({ image: { maxFileSize: "4MB" } })

    // Set permissions and file types for this FileRoute
    //It would run whenver someone has requested to uplaod a File; User -> MW(middleware)
    .middleware(async ({ req }) => {

        //Only authenticate user can upload a file
        //Checking from KindleSession;
        const {getUser} = await getKindeServerSession()
        const user = await getUser()

        //I can also try to use the following TRCP Error: throw new TRPCError({code: 'UNAUTHORIZED'})
        if(!user || !user.id) throw new Error("Unauthorized")
      
        // This code runs on your server before upload
        //const user = await auth(req);
 
        // If you throw, the user will not be able to upload
        //if (!user) throw new UploadThingError("Unauthorized");

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        //return { userId: user.id };
        //Passing the user information;
        return {userId: user.id}
  
    })

    //It runs when the file has been upload successfully; 
    .onUploadComplete(async ({ metadata, file }) => {

    //   // This code RUNS ON YOUR SERVER after upload
    //   console.log("Upload complete for userId:", metadata.userId);
 
    //   console.log("file url", file.url);
 
    //   // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    //   return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;