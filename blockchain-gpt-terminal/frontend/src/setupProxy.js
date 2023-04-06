const { createProxyMiddleware } = require("http-proxy-middleware");
console.log("Proxy configuration is loaded");
module.exports = function (app) {
  app.use(
    "/terminal",
    createProxyMiddleware({
      target: 'http://backend:5050',
      secure: false,
      changeOrigin: true,
      logLevel: "info",
    })
  );
};
