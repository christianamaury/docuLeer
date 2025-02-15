import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server"

//Matcher is enforce by Next.JS. Only users can visit these pages. Protected;
//Only login user can access these pages;
export const config = {
    matcher: ['/dashboard/:path*', '/auth-callback'],
}

export default authMiddleware