
//Component to upload Files once the user has been verified as a member.

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

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


const f = createUploadthing();
 
// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  // MaxFile can be increased if the user is a pro user
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })

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


    
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;