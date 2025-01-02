
//Matcher is enforce by Next.JS. Only users can visit these pages. Protected;
export const config = {
    matcher: ["/dashboard/:path*", "/auth-callback"]
}