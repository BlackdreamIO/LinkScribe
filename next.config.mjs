/** @type {import('next').NextConfig} */
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
