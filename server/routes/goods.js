var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Goods = require("../models/goods");

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1/dumall',{useNewUrlParser:true});

mongoose.connection.on('connected',function(){
    console.log("MongoDB connected success");
})
mongoose.connection.on('error',function(){
    console.log("MongoDB connected failed");
})
mongoose.connection.on('disconnected',function(){
    console.log("MongoDB connected disconnected");
})

router.get("/",function(req,res,next){
    //req.param获取客户端传过来的参数

    let page = Number(req.param('page'));   
    let pageSize =  Number(req.param('pageSize'));  //1页多少条数据
    let sort =  Number(req.param('sort'));      //sort1为升序，1为降序
    // console.log(page,pageSize,sort)
    // 分页: skip 跳过指定数量的数据  limit：指定读取数量的数据
    let skip = (page-1)*pageSize;
    let params = {}
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
    //find 查找所有数据

    goodsModel.sort({'salePrice':sort})
    goodsModel.exec(function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    })
})

module.exports = router;