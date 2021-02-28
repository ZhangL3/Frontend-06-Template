let http = require('http');
let fs = require("fs");

let file = fs.createReadStream("./sample.html");

// request to locolhost
// let request = http.request({
//   hostname: "127.0.0.1",
//   port: 8082,
//   method: "post",
//   headers: {
//     'Content-Type': 'application/octet-stream',
//   }
// }, response => {
//   console.log('response: ', response);
// })

// request to wsl ubuntu
let request = http.request({
  hostname: "192.168.177.230",
  port: 8882,
  method: "post",
  headers: {
    'Content-Type': 'application/octet-stream',
  }
}, response => {
  console.log('response: ', response);
})

file.on('data', chunk => {
  console.log('chunk: ', chunk.toString());
  request.write(chunk);
})

file.on('end', chunk => {
  console.log('read finished: ', chunk);
  // 这里 chunk 是 undefined，不能再写入了，因为写入内容必须为 string 或 buffer
  // request.write(chunk);
  // end 时请求才会发出
  request.end();
})
