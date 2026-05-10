/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@flowpatch/engine", "@flowpatch/db", "@flowpatch/types", "@flowpatch/ai", "@flowpatch/prompts", "@flowpatch/utils"],
};

module.exports = nextConfig;
