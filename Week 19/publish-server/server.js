let http = require('http');

http.createServer(function (req, res) {
  console.log('req: ', req);
  res.end("Hello World");
}).listen(8082);