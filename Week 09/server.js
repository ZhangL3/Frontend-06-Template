const http = require('http');

/**
 * Create a server, return the fixed content
 */
http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk.toString())
  }).on('end', () => {
    body = Buffer.concat([Buffer.from(body.toString())]).toString();
    console.log('body: ', body);
    response.writeHead(200, {'Content-Type': 'test/html'});
    response.end(`Hello\r
\r
World!!!!!!!!!!!!!!!!!!!!!`);
  })
}).listen(8088);

console.log('server started');