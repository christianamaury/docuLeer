
//Newest Pinecone Implementation way; 
import {Pinecone} from "@pinecone-database/pinecone"

export const pinecone = new Pinecone({
 
    //Getting api key from .env file 
    apiKey: process.env.PINECONE_API_KEY!,

}); 





// //PREVIOUS SDK SETUP
// import {PineconeClient} from "@pinecone-database/pinecone" 
// export const getPineconeClient = async () => {
//     const client = new PineconeClient()

//     await client.init({
//         apikey: process.env.PINECONE_API_KEY!, 
//         environment: "us-east1Test"
//     })

//     return client
// }