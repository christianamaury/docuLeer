
import {Pinecone} from "@pinecone-database/pinecone"

export const pinecone = new Pinecone({
    //Getting api key from .env file 
    apiKey: process.env.PINECONE_API_KEY!,
    

}); 

//PREVIOUS SDK SETUP
// export const pinecone = new Pinecone({
//     //Getting api key from .env file 
//     apiKey: process.env.PINECONE_API_KEY!,
//     environment: 'us-east-1',

// }); 