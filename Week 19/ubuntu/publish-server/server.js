let http = require('http');
// let fs = require('fs');
let unzipper = require('unzipper');

http.createServer(function (request, response) {
  console.log('request.headers: ', request.headers);

  // let outFile = fs.createWriteStream("../server/public/tmp.zip");
  // request.pipe(outFile);

  // request.on('data', chunk => {
  //   console.log('data: ', chunk.toString());
  //   outFile.write(chunk);
  // })

  // request.on('end', chunk => {
  //   outFile.end();
  //   console.log('success: ', chunk);
  // })
  request.pipe(unzipper.Extract({path: '../server/public/'}))
}).listen(8882);