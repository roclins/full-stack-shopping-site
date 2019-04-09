let express = require('express');
let router = express.Router();
let User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
设置路由，当post请求地址为 /login， 
*/ 
router.post('/login',(req,res,next)=>{
  //拿到前端传过来的参数，post请求 和 get 请求 传参和拿参 都不一样
  let param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  //使用定义好的User模型拿到数据库的参数，findOne，拿到一条数据
  User.findOne(param,(err,doc)=>{
    
    if(err){
      console.log("11");
      //res.json 返回的json格式 的数据，数据中的内容是可以自己定义的，但格式要统一
      res.json({     
        status:"1",
        msg:err.message
      })
    }else{
      console.log(1)
      if(doc){
        //设置前端Cookie：把用户名保存到Cookie中，第一个是参数的name，第二个是值，第三个参数是属性，
        res.cookie("userId",doc.userId,{
          path:'/',         //path是Cookie保存位置
          maxAge:1000*60*60  //maxAge 是Cookie 保存时间，1000是毫秒
        });
        res.cookie("userName",doc.userName,{
          path:'/',         //path是Cookie保存位置
          maxAge:1000*60*60  //maxAge 是Cookie 保存时间，1000是毫秒
        });
        res.json({
          status:"0",
          msg:"",
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
})

//登出
router.post('/logout',(req,res,next)=>{
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:"",
    result:''
  });
})

//登陆后，刷新，登陆状态又没了，所以加上一个检验登陆状态的路由
router.get('/checkLogin',(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'当前未登录',
      result:''
    })
  }
})
module.exports = router;
