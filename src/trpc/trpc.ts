import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';

//publicProcedure it allow us to create an API-EndPoint ..
//privateProcedure parameter when it exported would be the const variable: isAuth
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

//It's the actual user authenticate with our Provider; 
//middleware = Create Reusable Middleware
//opts parameters comes from trcp
const middleware = t.middleware
const isAuth = middleware (async (opts) => {

    //Check if the user gets verified with our Auth Provider;
    const {getUser} =  await getKindeServerSession()  
    const user = await getUser();

    //If we don't have an user or userID
    if(!user || !user.id){

        throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    //Return next action of our middleware which is our API route;
    //It also takes a context: ctx{}
    return opts.next({
        ctx: {
                userId: user.id, 
                user, 
             }
         })
})
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth)