let user = require("./user.js");
let http = require("http");
let url = require("url");


let util = require("util");

console.log(`username:${user.username}`);
console.log(`user:${user.age}`)

let server = http.createServer((req,res)=>{
    // req.setHeader("Accept","text/html");
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain;charset=utf-8");
    res.end(util.inspect(url.parse(req.url)))
})
server.listen(3000,'127.0.0.1',()=>{
    console.log("服务器已经运行，请打开浏览,输入:http://127.0.0.1:3000/ 来进行访问.")
})
const myUrl = url.parse("http://127.0.0.1:3000/")

// const {URL} = require("url");
// const myUrl = new URL("http://127.0.0.1:3000/");
console.log(myUrl);

