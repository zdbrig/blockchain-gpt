import {createProxyMiddleware}  from 'http-proxy-middleware';
const proxy = {
    target: 'http://authentification:3001',
    changeOrigin: false,
    secure: false
}
module.exports = function(app:any) {
  app.use(
    '/blockchain',
    createProxyMiddleware(proxy)
  );
  app.listen(3001);

};