/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
          {
            source: '/api/section/get',
            headers: [
              { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
            ],
          },
        ];
      },
};

export default nextConfig;
