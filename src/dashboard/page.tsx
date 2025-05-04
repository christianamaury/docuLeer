
//getKindeServerSession, basically use once the user has fully signed into their account;
//getUser variable information and save it on an user variable;
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
//redirect library for re-direct navigation purposes; 
import {redirect} from 'next/navigation'
//Database Model; 
import {db} from '@/db'
//Dashboard Component: 
import Dashboard from '@/app/Components/Dashboard'
import { getUserSubscriptionPlan } from "@/app/lib/stripe"
//!user doesn't exist, redirect them if theyre not signed in
//I also added the await method to the getKindeServerSession method()

const Page = async () => {
    const {getUser} = await getKindeServerSession()
    const user = await getUser();

    if(!user || !user.id) redirect('/auth-callback?origin=dashboard') 

    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    //If this user is not signed in to the database yet; 
    if(!dbUser) redirect('/auth-callback?origin=dashboard') 
 
    //Use it for testing purposes, to make sure the user is signed in.
    //return <div> {user.email} </div>

    const subscriptionPlan = await getUserSubscriptionPlan()

    //Dashboard Component
    return <Dashboard subscriptionPlan={subscriptionPlan} />
     
}

export default Page