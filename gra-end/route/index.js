// 路由管理

const config = require('../config')
const controller = require('../controller')
//const authIsVerified = require('../utils/auth')
const Router = require('koa-router')

const router = new Router({
    prefix: config.APP.ROOT_PATH
})

router
    .get('/',(ctx,next)=>{
        ctx.response.body = config.INFO;
    })

    .post('/register', controller.User.userCreate)     //注册用户
    .post('/login', controller.User.userLogin)         //用户登录
    .get('/userQuery/:page', controller.User.userQuery)  //用户查询
    .get('/userQueryById/:id', controller.User.userQueryById)  //单个用户查询
    .get('/queryUserById', controller.User.queryUserById)  //单个用户查询
    .post('/userUpdate', controller.User.userEdit)  //单个用户查询
    .post('/userEdit', controller.User.userUpdate)  //用户编辑
    .post('/userUpload',controller.User.userUpload)
    .post('/pwdUpdate',controller.User.updatePwd)
    .post('/deleteUserById',controller.User.deleteUser)


    .get('/orderQueryById',controller.Order.queryOrderById)    //查询用户订单
    .get('/orderQueryAll/:page',controller.Order.queryAllOrder)      //查询所有订单
    .get('/queryOrderByOrderId/:id',controller.Order.queryOrderByOrderId) //根据订单id查询订单
    .post('/deleteOrderById',controller.Order.deleteOrder)
    .post('/payment',controller.Order.postOrder)//生成订单


    .post('/addGoods',controller.Goods.AddGoods)             //添加商品
    .get('/getGoods/:page',controller.Goods.getGoods)        //查询全部商品（后台管理）
    .get('/getGood/:goodId',controller.Goods.getGood)        //查询全部商品
    .post('/getAllGoods',controller.Goods.getAllGoods)       //获取全部商品
    .post('/goodUpdate',controller.Goods.GoodUpdate)         //修改商品信息
    .post('/deleteGood',controller.Goods.deleteGood)         //删除商品
    .get('/getHotGoods',controller.Goods.getHotGoods)        //获取热门商品

    .post('/adminUpdate',controller.Admin.AdminUpdate)       //管理员信息更新
    .post('/adminLogin',controller.Admin.AdminLogin)         //管理员登录   
    .get('/adminQuery/:id',controller.Admin.AdminQuery)      //管理员查询
    .post('/adminUpload',controller.Admin.AdminUpload)       //管理员头像上传
    .post('/pwdAdminUpdate',controller.Admin.updateAdminPwd) //管理员密码修改


    .post('/addCart',controller.Cart.AddCart) //添加购物车
    .get('/getAllCart',controller.Cart.queryCart) //查询购物车
    .post('/deleteCart',controller.Cart.deleteCart) //删除购物车
    .post('/editCart',controller.Cart.editCart) //编辑购物车

    .post('/addAddress',controller.Address.addAddress)
    .post('/updateAddress',controller.Address.updateAddress)
    .post('/deleteAddress',controller.Address.deleteAddress)
    .get('/queryAddressByUserId',controller.Address.queryAddressByUserId)
    .get('/queryAddressById/:id',controller.Address.queryAddressById)




module.exports = router
