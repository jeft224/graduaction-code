import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/Page/Login'
import Register from '@/Page/Register'
import Cart from '@/Page/Cart'
import Order from '@/Page/Order'
import VMain from '@/Page/VMain'
import GoodsDetails from '@/Page/GoodsDetails'
import OrderCheck from '@/Page/OrderCheck'
import Profile from '@/Page/Profile'
import Payment from '@/Page/Payment'
import Paysuccess from '@/Page/Paysuccess'
import Goodslist from '@/Page/Goodslist'


import endLogin from '@/Server/endLogin'
import endHome from '@/Server/endHome'
import AddGoods from '@/Server/AddGoods'
import GoodsList from '@/Server/GoodsList'
import UserList from '@/Server/UserList'
import OrderList from '@/Server/OrderList'
import ownspace from '@/Server/ownspace'
import goodsAnalyze from '@/Server/GoodsAnalyze'
import server from '@/Server/server'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/vmain',
      children:[
        {path:'vmain', name: 'vmain', component: VMain,},
        {path: 'goodsDetails', name: 'goodsDetails', component: GoodsDetails},
        {path: '/goodlist', name: 'goodlist', component: Goodslist},
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
    },

    {path: '/paysuccess', name: 'paysuccess', component: Paysuccess},
    {path: '/payment', name: 'payment', component: Payment},
    {path: '/checkout', name: 'checkout', component: OrderCheck},
    {path: '/profile', name: 'profile', component: Profile},
    {
      path: '/admin/login',
      name: 'endLogin',
      component: endLogin,
      iconCls: 'social-freebsd-devil',
      leaf: true, //只有一个节点
      hidden:false
    },
    {
      path: '/admin',
      name: '首页',
      iconCls: 'home',
      leaf: true, //只有一个节点
      hidden:true,
      component: endHome,
      children: [
        { path: '/', component:server, name: 'tohome' },
        { path: '/ownspace', component: ownspace, name: '个人中心' }
      ]
    },

    {
      path: '/admin/usermanage',//usermanage /goodsmanage
      name: '用户管理',
      iconCls: 'social-freebsd-devil',
      component: endHome,
      children:[
        { path: '/userlist', component: UserList, name: '用户查询' },
      ]
    },
    {
      path: '/admin/goodsmanage',
      name: '商品管理',
      iconCls: 'social-freebsd-devil',
      component: endHome,
      children:[
        { path: '/goodslist', component:GoodsList, name: '商品查询' },
        { path: '/goods', component: AddGoods, name: '添加商品' },
      ]
    },
    {
      path: '/admin/ordermanage',
      name: '订单管理',
      iconCls: 'social-freebsd-devil',
      component: endHome,
      children:[
        { path: '/orderlist', component:OrderList, name: '订单查询' },
      ]
    },
    {
      path: '/admin/analysis',
      name: '商品分析',
      iconCls: 'ios-paw',
      leaf: true, //只有一个节点
      hidden:true,
      component: endHome,
      children: [
        { path: '/', component: goodsAnalyze, name: '商品销量分析' }
      ]
    },
  ]
})
