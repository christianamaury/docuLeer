
//Component to upload Files once the user has been verified as a member.

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

//Newest Pinecone Implementation way; 
import {Pinecone} from "@pinecone-database/pinecone"

//Library for the User Login verification;
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
//Importing Prisma db; 
import {db} from '@/db'
//langchain community library; 
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

//Class for generating embedding using the OpenAI API.
//To access OpenAIEmbeddings embedding models you’ll need to create an OpenAI account, 
//get an API key, and install the @langchain/openai integration package.
//Indexing and Retrieval: Embedding models are often used in retrieval-augmented generation (RAG) flows, 
//both as part of indexing data as well as later retrieving it.
//import {OpenAIEmbeddings} from "@langchain/embeddings/openai"
import {OpenAIEmbeddings} from "@langchain/openai"
//Pinecone Vector Integration;
import {PineconeStore} from "@langchain/pinecone"

import { pinecone } from "@/app/lib/pinecone";
import { getUserSubscriptionPlan } from "@/app/lib/stripe";
import { PLANS } from "@/config/stripe";

const f = createUploadthing();

//Testing
// const pinecone = await getPineconeClient(); 

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function


const middleware = async () => {

    //Only authenticate user can upload a file
        //Checking from KindleSession;
        const {getUser} = await getKindeServerSession()
        const user = await getUser()

        //I can also try to use the following TRCP Error: throw new TRPCError({code: 'UNAUTHORIZED'})
        if(!user || !user.id) throw new Error("Unauthorized")

        //Checking user Subscription Plan; 
        const subscriptionPlan = await getUserSubscriptionPlan()

        // This code runs on your server before upload
        //const user = await auth(req);
 
        // If you throw, the user will not be able to upload
        //if (!user) throw new UploadThingError("Unauthorized");

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        //return { userId: user.id };
        //Passing the user information;
        return {subscriptionPlan, userId: user.id}
}

const onUploadComplete = async ({metadata, file}: {
   //Declaring the types; 
   //Getting the information of the middleware function returns above;
   metadata: Awaited <ReturnType<typeof middleware>>
   file: {
    key: string
    name: string
   }

}) => {

      //Check statement so we don't call the createdFile twice; 
      //Checking if the file exist;
      const isFileExist = await db.file.findFirst({
        where: {
          key: file.key,
        },
      })

      if(isFileExist) return 

      //Adding the files using Prisma; 
      //medata.userId is pass through the .middleware; 
      //`https:/uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}` or file.key is the same.
      //Only difference is that the https website implementation always works. 
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name, 
          userId: metadata.userId, 
          url: `https:/uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`, 
          uploadStatus: 'PROCESSING', 
        }, 

      })

      try {

        //PDF file in memory 
          const response = await fetch (`https:/uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`)

          const blob = await response.blob()

          const loader = new PDFLoader(blob)

          const pageLevelDocs = await loader.load()
          
          //Each element from the array; 
          const pagesAmt = pageLevelDocs.length

          //Destruct subscriptionPlan from the metadata;
          const {subscriptionPlan} = metadata
          const {isSubscribed} = subscriptionPlan

          //Did they exceeded it .. If its true; plan exceeded
          const isProExceeded = pagesAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPDF

          // Free plan can be change. 
          const isFreeExceeded = pagesAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPDF

          //..Subcription plan from the user; 
          if((isSubscribed && isProExceeded || !isSubscribed && isFreeExceeded)){

            //Passing data that we would like to update.. 
            await db.file.update({
                data: {
                  uploadStatus: "FAILED"
                }, 
                where: {
                  id: createdFile.id,
                },
            }) 
          }

          //Vectorizing and indexing the entire document file; 
          const pineconeIndex = pinecone.Index("doculeer")

          //Model configuration; 
          const embeddings = new OpenAIEmbeddings ({

            openAIApiKey: process.env.OPENAI_API_KEY
          })

          // Receieves two arguments: 
          //Third argument: Configuration Object
          await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {

            //@ts-ignore
              pineconeIndex,
              namespace: createdFile.id, 

            }
          )

          //File uploaded to the Database; 
          await db.file.update({
            data: {
              uploadStatus:"SUCCESS"
            },
            where: {
              id: createdFile.id
            }
          })

      } catch (err) {

        //If there's any error on the uploading process; 
        await db.file.update({
          data: {
            uploadStatus:"FAILED"
          },
          where: {
            id: createdFile.id
          }

        })

      }
  
    //   // This code RUNS ON YOUR SERVER after upload
    //   console.log("Upload complete for userId:", metadata.userId);
 
    //   console.log("file url", file.url);
 
    //   // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    //   return { uploadedBy: metadata.userId };
 
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  // MaxFile can be increased if the user is a pro user
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })

    // Set permissions and file types for this FileRoute
    //It would run whenver someone has requested to uplaod a File; User -> MW(middleware)
    .middleware(middleware)

    //It runs when the file has been upload successfully; 
    .onUploadComplete(onUploadComplete),

      // Define as many FileRoutes as you like, each with a unique routeSlug
  // MaxFile can be increased if the user is a pro user
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })

  // Set permissions and file types for this FileRoute
  //It would run whenver someone has requested to uplaod a File; User -> MW(middleware)
  .middleware(middleware)

  //It runs when the file has been upload successfully; 
  .onUploadComplete(onUploadComplete),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;