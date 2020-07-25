const { runCrawler } = require('./session');

runCrawler().then(cookies => {
  const filteredCookies = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(['; ']);
  console.log(`Proxying using ... ${filteredCookies}`);
  
  const httpProxy = require('http-proxy');
  const headers = { 'Cookie': filteredCookies }
  const proxy = httpProxy.createProxyServer({
      target:'https://prod-useast-a.online.tableau.com/',
      changeOrigin: true,
      timeout: 100000,
      proxyTimeout: 100000,
      followRedirects: true,
      autoRewrite: false,
      changeOrigin: "https://prod-useast-a.online.tableau.com/",
      cookieDomainRewrite: {
        "*": "prod-useast-a.online.tableau.com"
      },
      cookiePathRewrite: {
        "*": "/"
      },
      headers: headers
  }).listen(8082);

  proxy.on('proxyReq', (proxyReq, req, res, options) => {
    // Aqui, você pode fazer um cache de recursos estáticos e também interceptar cabeçalhos
    // para fazer uma autenticação (de tempos em tempos) no cognito
    // https://www.npmjs.com/package/cognito-jwt-token-validator
    // Caso o token não seja válido, basta acionar:
    // res.end();
  });

  proxy.on('proxyRes', (proxyRes, req, res) => {
    delete proxyRes.headers['x-frame-options'];
  });

  proxy.on('error', (e) => {
    // silent exception
  })
});

