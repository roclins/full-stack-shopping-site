let express = require('express');
let router = express.Router();
let User = require('../models/user');

require('../util/util')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/*
设置路由，当post请求地址为 /login， 
*/
router.post('/login', (req, res, next) => {
  //拿到前端传过来的参数，post请求 和 get 请求 传参和拿参 都不一样
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  //使用定义好的User模型拿到数据库的参数，findOne，拿到一条数据
  User.findOne(param, (err, doc) => {

    if (err) {
      // console.log("11");
      //res.json 返回的json格式 的数据，数据中的内容是可以自己定义的，但格式要统一
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      // console.log(1)
      if (doc) {
        //设置前端Cookie：把用户名保存到Cookie中，第一个是参数的name，第二个是值，第三个参数是属性，
        res.cookie("userId", doc.userId, {
          path: '/',         //path是Cookie保存位置
          maxAge: 1000 * 60 * 60  //maxAge 是Cookie 保存时间，1000是毫秒
        });
        res.cookie("userName", doc.userName, {
          path: '/',         //path是Cookie保存位置
          maxAge: 1000 * 60 * 60  //maxAge 是Cookie 保存时间，1000是毫秒
        });
        res.json({
          status: "0",
          msg: "",
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

//登出
router.post('/logout', (req, res, next) => {
  res.cookie("userId", "", {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: "0",
    msg: "",
    result: ''
  });
})

//登陆后，刷新，登陆状态又没了，所以加上一个检验登陆状态的路由
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: '当前未登录',
      result: ''
    })
  }
});

//购物车中的数据，全在MongoDB中的users collection  中，所以，在users.js中拿
router.get('/cartList', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let params = {
      userId
    }
    User.findOne(params, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: []
        })
      } else {
        if (doc) {
          let cartList = doc.cartList;
          res.json({
            status: '0',
            msg: '',
            result: cartList
          })
        }
      }
    })
  } else {
    res.json({
      status: "1",
      msg: "当前用户不存在"
    });
  }
})

//购物车删除商品功能
router.post('/delCart', (req, res, next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;

  //update 更新子文档很方便

  //更新数据库   第一个参数: 查询条件，第二个参数：要删除的子文档，$pull 是删除的功能，$pull中，key是要删除的项，value查询条件
  User.update({ userId: userId }, { $pull: { 'cartList': { 'productId': productId } } }, (err, doc) => {
    if (err) {  //TODO
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      });
    }
  })
})

//购物车加减功能
router.post('/editCart', (req, res, next) => {
  let userId = req.cookies.userId;
  productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;

  User.update({ 'userId': userId, 'cartList.productId': productId }, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked,
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      });
    }
  })
})

//购物车选择全部功能
router.post('/selectAll', (req, res, next) => {
  let userId = req.cookies.userId;
  let selectAll = req.body.selectAll ? '1' : '0';
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        doc.cartList.forEach((item) => {
          item.checked = selectAll;
        })
        doc.save((err2, doc2) => {
          if (err2) {
            res.json({
              status: '1',
              msg: err2.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        })
      }
    }
  })
})

//获取地址接口
router.get('/address', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.addressList
        })
      }
    }
  })
})

//设置默认地址接口
router.post('/setDefaultAddress', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId id null',
      result: ''
    })
    return
  }
  User.findOne({ userId: userId }, (err1, doc1) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message,
        result: ''
      })
    } else {
      if (doc1) {
        doc1.addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        })
        doc1.save((err2, doc2) => {
          if (err2) {
            res.json({
              status: '1',
              msg: err2.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            })
          }
        })
      }
    }
  })
})

//删除地址接口
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  User.update({ userId: userId }, { $pull: { 'addressList': { 'addressId': addressId } } }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      });
    }
  })
})

//支付接口
router.post('/payment', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  let orderTotal = req.body.orderTotal;

  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else{
      let address = '';
      let goodsList = [];
      if(doc){
        //通过传过来的addressId 查询 数据库，获取 地址信息
        doc.addressList.forEach((item)=>{
          if(addressId == item.addressId){
            address = item
          }
        });
        //通过查询数据库中的orderList中的checked === ‘1’，找到用户选择的信息
        goodsList=doc.cartList.filter((item)=>{
          return item.checked === '1'
        });

        //生成订单，保存到 数据库的orderList 中
        let platform = '622';
        let r1 = Math.floor(Math.random()*10);
        let r2 = Math.floor(Math.random()*10);

        let sysDate = new Date().Format('yyyyMMddhhmmss');
        let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        let orderId = platform+r1+sysDate+r2;
        let order = {
          orderId:orderId,
          orderTotal:orderTotal,
          addressInfo:address,
          goodsList:goodsList,
          orderStatus:'1',
          createDate:createDate
        };

        doc.orderList.push(order);

        doc.save((err2,doc2)=>{
          if (err2) {
            res.json({
              status: '1',
              msg: err2.message,
              result: ''
            })
          }else{
            res.json({
              status:"0",
              msg:'',
              result:{
                orderId:order.orderId,
                orderTotal:order.orderTotal
              }
            })
          }
        })
      }
    }
  })
})

module.exports = router;
