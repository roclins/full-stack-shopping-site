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

router.get("/list",function(req,res,next){
    //req.param获取客户端传过来的参数
    let startPrice = Number(req.param('startPrice'));
    let endPrice = Number(req.param('endPrice'));
    let page = Number(req.param('page'));   
    let pageSize =  Number(req.param('pageSize'));  //1页多少条数据
    let sort =  Number(req.param('sort'));      //sort1为升序，1为降序
    // console.log(page,pageSize,sort)
    // 分页: skip 跳过指定数量的数据  limit：指定读取数量的数据
    let skip = (page-1)*pageSize;
    let params = {};
    if(startPrice&&endPrice){
        params = {
            salePrice:{
                $gt:startPrice,
                $lte:endPrice
            }
        }
    }
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

/*
    当路由匹配到 /goods/addCart ，回调函数执行
*/
router.post('/addCart',(req,res,next)=>{
    let userId = '100000077';
    let productId = req.body.productId;
    // let productId = req.params("productId");  //produc 为 前端传过来的参数 商品的id
    // console.log(req);
    console.log(productId);
    let User = require("../models/user"); //User 会自动匹配到 users 集合
    User.findOne({userId:userId},(err,userDoc)=>{   
        //查找userId 为 userId 的那一条数据  ，userDoc 为返回来的数据

        //有err ，返回错误
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            //没有err
            // console.log('userDoc:'+userDoc);
            //当返回数据不为空时
            if(userDoc){
                let goodsItem = '';  //用来查看cartList是否存再这条数据
                userDoc.cartList.forEach((item)=>{
                    //购物车存再这条数据，productNum ++ 
                    if(item.productId === productId){
                        goodsItem:item;
                        item.productNum++
                    }
                });

                //存在这条数据，num ++ 后，保存数据库
                if(goodsItem){
                    userDoc.save((err2,doc2)=>{
                        if(err2){
                            res.json({
                                status:"1",
                                msg:err.message 
                            })
                        }else{
                            res.json({
                                status:"0",
                                msg:"",
                                result:'suc'
                            })
                        }
                    })
                }else{
                    //购物车不存在这条商品信息，意思是新加入的商品：
                    //到goods表中，查找这条商品信息，加入到user.cartList中
                    Goods.findOne({productId:productId},(err1,doc)=>{
                        //错误，则请求返回err
                        if(err1){
                            res.json({
                                status:'1',
                                msg:err1.message
                            })
                        }else{
                            //没有错误，返回查到到的数据
                            if(doc){
                                doc.productNum=1;  //这两个属性在goods中是没有
                                doc.checked=1;
                                userDoc.cartList.push(doc); //加入到用户 userId 所在的那条数据的cartList中
                                userDoc.save((err2,doc2)=>{
                                    if(err2){
                                        res.json({
                                            status:"1",
                                            msg:err.message 
                                        })
                                    }else{
                                        res.json({
                                            status:"0",
                                            msg:"",
                                            result:'suc'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
})

module.exports = router;