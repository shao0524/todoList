module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        node: "/node_modules",
        sass: "@/assets/sass",
        components: "@/components",
        image: "@/assets/image",
      },
    },
  },
};
