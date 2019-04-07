const http = require("http")
const url = require("url")
const util = require("util")
const fs = require("fs")

console.log("1");

let server = http.createServer((req,res)=>{
    console.log("2");
    let myUrl = url.parse(req.url) 
    console.log(myUrl)
    let pathname = myUrl.pathname.substring(1);
    fs.readFile(pathname,(err,data)=>{
        if(err){
            res.writeHead(404,{
                'Content-Type':'text/html'
            })
        }else{
            res.writeHead(200,{
                'Content-Type':'text/html'
            })
            res.write(data)
        }
        res.end();
    })    
})
server.listen(3002,'127.0.0.1',()=>{
    console.log("服务器已经运行，请打开浏览,输入:http://127.0.0.1:3002/ 来进行访问.")
})

// let http = require('http');
// let url = require('url');
// let util = require('util');
// let fs = require('fs');

// let server = http.createServer((req,res)=>{
//   //res.statusCode = 200;
//   //res.setHeader("Content-Type","text/plain; charset=utf-8");

//   var pathname = url.parse(req.url).pathname;
//   console.log("file:"+pathname.substring(1))
//   fs.readFile(pathname.substring(1), function (err,data) {
//       if(err){
//           res.writeHead(404,{
//             'Content-Type':'text/html'
//           });
//       }else{
//         res.writeHead(200,{
//           'Content-Type':'text/html'
//         });
//         res.write(data.toString());
//       }

//       res.end();
//   });

// });

// server.listen(3002,'127.0.0.1', ()=>{
//   console.log("服务器已经运行，请打开浏览,输入:http://127.0.0.1:3000/ 来进行访问.")
// });
