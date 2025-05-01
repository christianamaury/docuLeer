import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server"

//Matcher is enforce by Next.JS. Only users can visit these pages. Protected;
//Only login user can access these pages;
export const config = {

    //removing: '/auth-callback' from the matcher since its part of the Flow; 
    matcher: ['/dashboard/:path*']
}

export default authMiddleware