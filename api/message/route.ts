import { SendMessageValidator } from '@/app/lib/validators/SendMessageValidator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest } from "next/server";
//Database Model; 
import {db} from '@/db'

//import {OpenAIEmbeddings} from "@langchain/embeddings/openai"
import {OpenAIEmbeddings} from "@langchain/openai"

//Pinecone Vector Integration;
import {PineconeStore} from "@langchain/pinecone"

import { pinecone } from "@/app/lib/pinecone";
import { openai } from '@/app/lib/openai';

//From the ai package; Version 2.2.13
import {OpenAIStream, StreamingTextResponse} from 'ai'

//Handliing end API route; 
export const POST = async (req: NextRequest) => {
    //Endpoint route for asking a question to a PDF file; 

    const body = await req.json()

    const {getUser} = await getKindeServerSession();
    const user = await getUser();
    //const {id: userId} = user

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
    //Vectorizing message; 
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
    })

      //NEEDS TO BE TESTED IT; Function below doesn't exist yet;
      //const pinecone = await getPinconeClient()
      //Vectorizing and indexing the entire document file; 
      const pineconeIndex = pinecone.Index("doculeer")

      //Search for vector element on the PDF file;
      //It takes two argument: embeddings variable, and configuration Object;
      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            namespace: file.id
      })

      //Getting the results from PineconeStore;
      //We want the 4 closest things to our message
      const results = await vectorStore.similaritySearch(message, 4)

      //If there's a chat history, we would like to see the previous messages from the user;
      //Asking our Database; Last previous 6 messages; 
      const prevMessages = await db.message.findMany({
        where: {
            fileId
        },
        orderBy: {
            createdAt: "asc"
        },
        take: 6 
      })

      //Mapping through the messages
      //Return Object implicity
      const formattedMessages = prevMessages.map((msg) => ({
            role: msg.isUserMessage ? "user" as const : "assistant" as const, 
            content: msg.text
      }))

      //Sending Previous Messages to OpenAI for a Response; 
      //openai would be a utility file in the lib folder;
      //rename the results to result within the CONTEXT below section; 
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        temperature: 0,
        stream: true,
        messages: [
            {
              role: 'system',
              content:
                'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
            },
            {
              role: 'user',
              content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
              
        \n----------------\n
        
        PREVIOUS CONVERSATION:
        ${formattedMessages.map((message) => {
          if (message.role === 'user') return `User: ${message.content}\n`
          return `Assistant: ${message.content}\n`
        })}
        
        \n----------------\n
        
        CONTEXT:
        ${results.map((r) => r.pageContent).join('\n\n')}
        
        USER INPUT: ${message}`,
            },
          ],
      })

      //Had to converte the response object due to a type mismatch between what the OpenAI library returns 
      //(Stream<ChatCompletionChunck>) and what the OpenAIStream function expects
      //Converting the OpenAI response to an AsyncIterable; 
      //In order to supress the implicity stream has any type warning error. Using TypeScript;
      // @ts-ignore
      async function* streamToAsyncIterable(stream){
        const reader = stream.getReader();
        try{
          while(true)
          {
            const {value, done} = await reader.read();
            if(done) break;
            yield value;
          }
         
        }
        finally {
          reader.releaseLock();
        }

      }

      //Using the Converted AsyncIterable in OpenAIStream
      //Passing through our argument which is response;
      const asyncIteralbleResponse = streamToAsyncIterable(response)

      //Takes a response and object argument
      const stream = OpenAIStream(asyncIteralbleResponse, {
        async onCompletion(completion){
          await db.message.create({
            data: {
              text: completion, 
              isUserMessage: false, 
              fileId, 
              userId
            },
          })

        },
      })

      //Real time processing back to the Client; 
      //Passing through our steam value from our API route; 
      return new StreamingTextResponse(stream)

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
