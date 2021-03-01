let http = require('http');
let fs = require("fs");
let archiver = require("archiver");
let child_process = require("child_process")

// let file = fs.createReadStream("./sample.html");
let request;

// 1. 打开 https://github.com/login/oauth/authorize

child_process.exec(
  `start https://github.com/login/oauth/authorize?client_id=Iv1.f71dba4980135246`, (err) => {
  console.log('err: ', err);
});


// 3. 创建 server，接受 token，然后点击发布

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

// request to wsl ubuntu (single file with pipe)
// fs.stat("./sample.html", (err, stats) => {
//   request = http.request({
//     hostname: "192.168.177.230",
//     port: 8882,
//     method: "post",
//     headers: {
//       'Content-Type': 'application/octet-stream',
//       // pipe file 需要 size
//       'Content-Length': stats.size,
//     }
//   }, response => {
//     console.log('response: ', response);
//   })

//   file.pipe(request);

//   // file.on('data', chunk => {
//   //   console.log('chunk: ', chunk.toString());
//   //   request.write(chunk);
//   // })

//   file.on('end', chunk => {
//     console.log('read finished: ', chunk);
//     // 这里 chunk 是 undefined，不能再写入了，因为写入内容必须为 string 或 buffer
//     // request.write(chunk);
//     // end 时请求才会发出
//     request.end();
//   })
// })

// file.on('end', chunk => {
//   console.log('read finished: ', chunk);
//   request.end();
// })

// multi files

// request = http.request({
//   hostname: "192.168.177.230",
//   port: 8882,
//   method: "post",
//   headers: {
//     'Content-Type': 'application/octet-stream',
//   }
// }, response => {
//   console.log('response: ', response);
// })

// // file.pipe(request);

// // 压缩文件夹并 pipe 给 request
// const archive = archiver('zip', {
//   zlib: {level: 9}
// });

// archive.directory('./sample/', false);
// archive.finalize();
// // archive.pipe(fs.createWriteStream("tmp.zip"));
// archive.pipe(request);
