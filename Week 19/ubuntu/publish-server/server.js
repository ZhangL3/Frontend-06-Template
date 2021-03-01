let http = require('http');
let https = require('https');
// let fs = require('fs');
let unzipper = require('unzipper');
let querystring = require('querystring');
const { hostname } = require('os');

// 2. auth 路由：接收 code，用 code + client_id + client_secret 换 token
function auth(request, response) {
  let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  console.log('query: ', query.code);
  getToken(query.code);
}

function getToken(code) {
  let request = https.request({
    hostname: "github.com",
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.f71dba4980135246&client_secret=6d2682b27220fbea5516e07a4bdc4d1e921c1ad7`,
    port: 443,
    method: "POST",
  }, function(response) {
    console.log('response: ', response);
    // response.on('data', chunk => {
    //   console.log('!!!!!! chunk: ', chunk.toString());
    //   return;
    // })
  });
  request.end();
}

// 4. publish 路由: 用 token 获取用户信息, 检查权限,接受发布
function publish(request, response) {

}

http.createServer(function (request, response) {
  // request.url: http://localhost:8882/auth?code=3d03cf2cf054fea6a484
  if (request.url.match(/^\/auth\?/)) {
    return auth(request, response);
  }
  if (request.url.match(/^\/publish\?/)) {
    return publish(request, response);
  }
  // console.log('request.headers: ', request.headers);

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