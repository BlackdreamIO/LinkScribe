/** @type {import('next').NextConfig} */
import path from 'path';
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                  {
                    key: "Set-Cookie",
                    value: "HttpOnly;Secure;SameSite=None",
                  },
                ],
              },
        ];
    },
    serverActions: {
      serverActionsBodySizeLimit : '4mb' // Set desired value here
    },
    images: {
      remotePatterns: [
      {
         protocol: "https",
         hostname: "**",
       },
      ],
   },
};

export default nextConfig;
