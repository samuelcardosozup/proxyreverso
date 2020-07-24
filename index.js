const httpProxy = require('http-proxy');

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
    headers: {
      'Cookie': `workgroup_session_id=; XSRF-TOKEN=; hid=; AWSELB=; tableau_locale=pt`,
      'X-XSRF-TOKEN': ''
    }
}).listen(8082);

proxy.on('proxyRes', (proxyRes, req, res) => {
  delete proxyRes.headers['x-frame-options'];
});

proxy.on('error', (e) => {
  console.log(e);
})