//publicProcedure it allow us to create an API-EndPoint
//query: get request, getting data
//mutuation modify or delete data
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import {db} from '@/db'
import {z} from 'zod'
//Value it's 10 for the infinite query limit;
import {INFINITE_QUERY_LIMIT} from '@/config/infinite-query' 
import { Input } from '@/components/ui/input';

// Stripe Library; 
import Stripe from 'stripe'

//TESTING
import { UploadStatus } from '@prisma/client';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, stripe } from '@/app/lib/stripe';
import { PLANS } from '@/config/stripe';

//publicProcedure = it basically means that anyone can query this API endpoint; 

 
export const appRouter = router({
//..Query Request and Getting user ID to see if its there;
authCallback: publicProcedure.query(async () => {
const { getUser } = await getKindeServerSession()
const user = await getUser()

    if(!user?.id || !user?.email) 
    //Error Utility from TRPC
    throw new TRPCError({code: 'UNAUTHORIZED'})

    //Check if user is in the Database. Attempting to find user in our Databse;
    const dbUser =  await db.user .findFirst({
        where: {
            id: user.id
        }
    })

    if(!dbUser){
        //Create user in DataBase;
        await db.user.create({
            data:{
                id: user.id,
                email: user.email
            }
        })

    }
    //Changed the success property. I can also try with the 200 status code
    return {success: true}
    // return {status: 'success'}

    }),

    getUserFiles: privateProcedure.query(async ({ctx}) => {
        //Destructin from the Context Variable in the trpc, index.ts
        const {userId} = ctx
        return await db.file.findMany({

            where: {userId}

        })
    }),

    //Stripe Purposes Session; 
    //Destructing the Context;
    createStripeSession: privateProcedure.mutation(async ({ctx}) => {
        //Destructing userId from the ctx right away;
        const {userId} = ctx

        //We need an absolute url;
        //from the utils.ts that we just created;
        const billingUrl = absoluteUrl("/dashboard/billing")

        //If we don't have an user, throw an error;
        if(!userId) throw new TRPCError ({code: "UNAUTHORIZED"})

        // Fetching user from our Database; 
        const dbUser = await db.user.findFirst({
            where: {
                id: userId
            }
        })

         //If we don't have an user, throw an error;
         if(!dbUser) throw new TRPCError ({code: "UNAUTHORIZED"})

         //Page where they can register, 
         const subscriptionPlan = await getUserSubscriptionPlan()

        //If Customer is actually subscribed to it;
         if(subscriptionPlan.isSubscribed && dbUser.stripeCustomerId)
         {
            // Passing configuration object; 
            const stripeSession = await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: billingUrl,
            })

            return {url: stripeSession.url}
         }

         //API Route;
        //Customer isn't subscribed yet, lets let them move forward; 
        //Passing configuration Object; 
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: billingUrl, 
            cancel_url: billingUrl, 
            payment_method_types: ["card", "paypal"],
            mode: "subscription",
            billing_address_collection: "auto", 
            line_items: [{
                price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
                quantity: 1
            }],

            metadata: {
                //In order to enable their plan and everything works accordingly;
                userId: userId
            }

        })

        return {url: stripeSession.url}

    }),

    //Creating a route endpoint; 
    //Response would be expect as an object
    //query takes a callback;
    //Destructing through the query the messages that we would like to show;
    getFileMessages: privateProcedure.input(
        z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.string().nullish(), 
            fileId: z.string()
        })
    ).query( async({ctx, input}) => {
       //Files own by this user would be Fetch; 
       const {userId} = ctx
       const {fileId, cursor} = input 
       const limit = input.limit ?? INFINITE_QUERY_LIMIT 

      //Finding file first in the Database;    
       const file = await db.file.findFirst({
        where: {
            id: fileId, 
            userId
        }
   
       })

        //If user doesn't have that file, throw an error of NOT_FOUND
       if(!file) throw new TRPCError({code: 'NOT_FOUND'})


       //Fetching messages, 
       const messages = await db.message.findMany({
        //1 would be from where point needs to be taken;
        //act as the cursor when he slide all the way up or Down;
        take: limit + 1,
        where: {
            fileId
        },
        orderBy: {
            createdAt: "desc"
        }, 
        cursor: cursor ?  {id: cursor} : undefined,
        select: {
            id: true, 
            isUserMessage: true,
            createdAt: true, 
            text: true,

        }

       })

        //which message is the cursor
        let nextCursor: typeof cursor | undefined = undefined
        
        //If there's more messages than the allow in the Database; 
        if(messages.length > limit)
        {
            //Removes the last element from an array and returns it. 
            const nextItem = messages.pop();
            nextCursor = nextItem?.id
        }

        return {
            messages, 
            nextCursor
            
        }
        
    }),

        //It seems that this Data is on a Deeper Nested Object
        //To access the status variable: data?.state?.data?.status instead data?.status
        getFileUploadStatus: privateProcedure.input(z.object({fileId: z.string() })).query(async ({input, ctx}) => {
            const file = await db.file.findFirst({
                where: {
                    id: input.fileId,
                    userId: ctx.userId,
                },
            })

            //Returning const just for typescript purposes. Validate attribue on Prisma too; 
             if(!file) return { status: 'PENDING' as const} 
            // if(!file){
            //     return { status: 'PENDING' as const}
            // }

            return { status: file.uploadStatus }
        }), 

    //Adding Get File Uploaded Files from the user;
    //PrivateProcedure: only signed in users can do it; 
    getFile: privateProcedure.input(z.object({key: z.string()})).mutation(async({ctx, input}) => {

        const {userId} = ctx

        //Checking if the file is in our Database;
        const file = await db.file.findFirst({
            where: {
                key: input.key, 
                userId,
            },
        })

        // If there's no file in the Database yet
        if(!file) throw new TRPCError({code: "NOT_FOUND"})

        //If there's a file
        return file
    }),

    /* For the Delete File API Route; Private Procedure because not anyone should be able to do that. User needs to be login so it does work */
    /* Input its like a Post Body for the user, inputs from the server side */
    /* z takes an object, .mutation takes a callback function */
    deleteFile: privateProcedure.input(z.object({id: z.string() })
    
    ).mutation(async({ctx, input}) => {
        const {userId} = ctx 
        //Searching to see if the file matchs on the server to have it delete it. 
        const file = await db.file.findFirst({
            where: {
                id: input.id, 
                userId, 
            }, 
        })

        //If there's no files to delete in the first place, throw an error for the user; 
        if(!file) throw new TRPCError({code: "NOT_FOUND"})
        //Deleting the file now;
        await db.file.delete({
            where: {
                id: input.id, 
            },
        })

        return file
    }), 

 })
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;