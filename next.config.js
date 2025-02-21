/** @type {import('next').NextConfig} */

//We have to do this config in order to use our PDF
const nextConfig = {

    //Configuration for the Link onCurrent{'/sign-in'} actually works; 
    async redirects(){

        // Return Two Objects: 
        return [
            {   
                source: "/sign-in",
                destination: "/api/auth/login",
                permanent: true,
            }, 

            {
                source: "/sign-up",
                destination: "/api/auth/register",
                permanent: true,
            },
        ]
    },


    webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    },
}

module.exports = nextConfig
