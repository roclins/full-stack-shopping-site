const http = require("http")

const url = require("url")
//对url地址进行解析

const util = require("util")

http.get("http://node.js.cn/index.json",(res)=>{
    let data = '';
    res.on('data',(chunk)=>{
        data += chunk;
    });
    res.on('end',()=>{
        let result = data
        console.log(`data:${result}`);
    })
})