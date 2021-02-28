let http = require('http');
let fs = require('fs');

http.createServer(function (request, response) {
  console.log('request.headers: ', request.headers);

  let outFile = fs.createWriteStream("../server/public/index.html");

  request.on('data', chunk => {
    console.log('data: ', chunk.toString());
    outFile.write(chunk);
  })

  request.on('end', chunk => {
    outFile.end();
    console.log('success: ', chunk);
  })
}).listen(8882);