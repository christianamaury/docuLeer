/** @type {import('next').NextConfig} */
//We have to do this config in order to use our PDF
const nextConfig = {
    webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    },
}

module.exports = nextConfig
