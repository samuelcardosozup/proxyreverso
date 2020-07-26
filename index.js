const { runCrawler } = require('./session');
const httpProxy = require('http-proxy');

// variavel com os cookies
let filteredCookies;

runCrawler().then(cookies => {
  filteredCookies = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(['; ']);
  console.log(`Proxying using ... ${filteredCookies}`);

  // Configuracao do proxy
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
      }
  }).listen(8082);

  // Validacao da sessao de tempos em tempos
  setInterval(() => {
    runCrawler().then(cookies => {
      filteredCookies = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(['; ']);
    });
  }, 10000)
  
  // Configuracao dos requests
  proxy.on('proxyReq', (proxyReq, req, res, options) => {
    // Adicionando o cookie
    try {
      proxyReq.setHeader('Cookie', filteredCookies);
    } catch(err) {
      // silent excetion (para os cookies ja enviados)
    }

    // TODO: cache recursos estáticos (redis ou memória do servidor)

    // TODO: recuperar a URL original de chamada e o JWT (autenticacao de tempos em tempos)
    // https://www.npmjs.com/package/cognito-jwt-token-validator 
    // res.end();

    // TODO: recuperar o id do hospital e verificar se aquele usuario tem acesso ao hospital
  });

  proxy.on('proxyRes', (proxyRes, req, res) => {
    // Removendo header que impedia a visualizacao do response no iframe
    delete proxyRes.headers['x-frame-options'];
  });

  proxy.on('error', (e) => {
    // silent exception
  })
});

