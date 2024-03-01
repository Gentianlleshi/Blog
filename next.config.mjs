/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sardinie.web-devtesting.xyz",
        // Optionally, specify a port and pathname if needed
        // port: '',
        // pathname: '/path/to/images/**',
      },
    ],
  },
};

export default nextConfig;
