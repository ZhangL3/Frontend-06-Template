let http = require('http');

http.createServer(function (request, response) {
  console.log('request.headers: ', request.headers);

  request.on('data', chunk => {
    console.log('data: ', chunk.toString());
  })

  request.on('end', chunk => {
    console.log('success: ', chunk);
  })
}).listen(8082);