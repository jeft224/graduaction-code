<template>
    <div id="header">
      <div class="header-img">
        <router-link to="/"><img src="../assets/logo.png" alt=""></router-link>
      </div>
      <div class="header-title">
        <div class="header-nav">
          <p v-if="UserShow">欢迎来到vue商城，
            <router-link :to="{path:`/login`}">请登录</router-link>
            <router-link to="/register">免费注册</router-link>
          </p>
          <p v-else>
            <!--<Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />-->
            <Avatar :src="userAvatar" />
            <Dropdown @on-click="handleClickUserDropdown">
              <router-link to="/profile">
                {{username}}
                <Icon type="arrow-down-b"></Icon>
              </router-link>
              <DropdownMenu slot="list">
                <DropdownItem name="InSelf">个人中心</DropdownItem>
                <DropdownItem name="signOut" divided>退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </p>
        </div>
        <div class="header-nav"><router-link to="/order"><Icon type="compose" color="red"></Icon>我的订单</router-link></div>
        <div class="header-nav" @mouseover="cartShowState(true)" @mouseout="cartShowState(false)">
          <router-link to="/cart" ><Icon type="android-cart" color="red"></Icon>购物车</router-link>
          <!--购物车显示块-->
          <div class="nav-user-wrapper pa active" v-show="showCart">
            <div class="nav-user-list">
              <div class="full" v-show="totalNum">
                <!--购物列表-->
                <div class="nav-cart-items">
                  <ul>
                    <li class="clearfix" v-for="(item,i) in cartList" :key="i">
                      <div class="cart-item">
                        <div class="cart-item-inner">
                          <router-link :to="'goodsDetails?productId='+item.productId">
                            <div class="item-thumb">
                              <img :src="item.productImg">
                            </div>
                          </router-link>
                          <div class="item-desc">
                            <div class="cart-cell">
                              <h4>
                                <router-link :to="'goodsDetails?productId='+item.productId"
                                             v-text="item.productName"></router-link>
                              </h4>
                              <p class="attrs"><span>白色</span>
                              </p> <h6><span class="price-icon">¥</span><span
                              class="price-num">{{item.productPrice}}</span><span
                              class="item-num">x {{item.productNum}}</span>
                            </h6></div>
                          </div>

                          <div class="del-btn del" @click="delGoods(item.productId)">删除</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <!--总件数-->
                <div class="nav-cart-total"><p>共 <strong>{{totalNum}}</strong> 件商品</p> <h5>合计：<span
                  class="price-icon">¥</span><span
                  class="price-num">{{totalPrice}}</span></h5>
                  <h6>
                    <div class="to-cart"><router-link to="/cart">去购物车</router-link></div>
                  </h6>
                </div>
              </div>
              <div v-show="!totalNum" style="height: 313px;text-align: center" class="cart-con">
                <p>你的购物车竟然是空的!</p>
              </div>
            </div>
          </div>
        </div>
        <div class="header-nav"><router-link to="/goodlist"><Icon type="social-octocat" size="18" color="red"></Icon>全部商品</router-link></div>
      </div>
    </div>
</template>

<script>
  import {exportUser} from '../utils/jwt'
  import {mapState} from 'vuex'
  import api from '../api'
    export default {
        name: "vheader",
        data(){
          return{
            showCart:false,
            // username:'',
            // cartList:[
            //   {
            //     "productId":"100032701",
            //     "productImg":"http://image.smartisanos.cn/resource/41cb562a47d4831e199ed7e2057f3b61.jpg",
            //     "productName":"极米无屏电视 CC",
            //     "checked":"1",
            //     "productNum":2,
            //     "productPrice":2799,
            //     "_id":"5aab33a5ab948846fbb23d58"
            //   },
            //   {
            //     "productId":"100032702",
            //     "productImg":"http://image.smartisanos.cn/resource/41cb562a47d4831e199ed7e2057f3b61.jpg",
            //     "productName":"极米无屏电视 CC",
            //     "checked":"1",
            //     "productNum":2,
            //     "productPrice":2799,
            //     "_id":"5aab33a5ab948846fbb23d58"
            //   }
            // ],
            // totalNum:0
          }
        },
        created(){
          // api.getAllCart().then((res)=>{
          //   console.log(res.data.result)
          //   if(res.data.result){
          //     this.$store.dispatch('SetCartList',res.data.result);
          //   }
          // })
        },
        mounted(){
          if(this.token){
            this.$store.dispatch('UserStatus', false);
            this.$store.dispatch('SetUserName',exportUser());
            api.getAllCart().then((res)=>{
              this.$store.dispatch('SetCartList',res.data.result);
            })
            api.queryUserById().then((res)=>{
              if(res.data.result.avatar.includes('http')||res.data.result.avatar.includes('https')){
                this.$store.dispatch('SetUserAvatar',res.data.result.avatar);
              }else{
                this.$store.dispatch('SetUserAvatar',`http://localhost:8000/${res.data.result.avatar}`);
              }

            })
          }

        },
        computed:{
          ...mapState({UserShow:'UserShow',token:'token',username:'username',cartList:'cartList',userAvatar:'userAvatar'}),
          // 计算价格
          totalPrice () {
            let totalPrice = 0
            this.cartList.length && this.cartList.forEach(item => {
              totalPrice += (item.productNum * item.productPrice)
            })
            return totalPrice
          },
          // 计算数量
          totalNum () {
            let totalNum = 0
            console.log(this.cartList.length);
            this.cartList.length &&this.cartList.forEach(item => {
                totalNum += (item.productNum)
              })
              return totalNum

          }
        },
        methods:{
          cartShowState(obj){
            this.showCart =obj;
          },
          handleClickUserDropdown(name){
            if (name === 'InSelf') {
              this.$router.push({
                name: 'profile'
              });
            } else if (name === 'signOut') {
              // 退出登录
              this.$store.dispatch('UserStatus', true);
              this.$store.dispatch('SetUserName', "");
              this.$store.dispatch('SetCartList',[]);
              this.$store.dispatch('UserLogOut');
              this.$router.push({name:'home'})
            }
          },
          delGoods(id){
            this.$Loading.start();
              api.deleteCart({productId:id}).then((res)=>{
                this.$store.dispatch('ReduceCartList',{productId:id});
                this.$Message.success(res.data.message);
                this.$Loading.finish();
              })
          }
        }
    }
</script>

<style scoped lang="scss">
  #header{
    padding: 5px 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    /*background: #e3f8f6;*/
    color: #000;
    position: fixed;
    z-index: 21;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #dadada;
    background-image: linear-gradient(#fff,#f1f1f1);
    /*background-image: linear-gradient(#bef5f1, #89e9d8);*/
  }
  #header .header-img a>img{
    height: 45px;
    width: 45px;
  }
  #header .header-title{
    list-style: none;
    position: relative;
  }
  #header .header-title>.header-nav{
    float: left;
    display: inline;
    margin-left: 8px;
    font-size: 16px;
    height: 32px;
    line-height: 32px;
  }
  #header .header-title .header-nav .ivu-dropdown{
    margin-right: 10px;
  }
  #header .header-title>li:first-child>p{
    display: inline;
  }
  #header{
    .header-title{
      li{
        /*padding:0px 5px;*/
        /*border-right: 1px solid #000;*/
        a{
          i{
            padding-right: 5px;
          }

        }
      }
      li:last-child{
        border-right: none;
      }
    }
  }
  //购物车样式
  .active {
    color: #c81623;
  }
  .pa {
    position: absolute;
  }
  .nav-user-wrapper {
    position: absolute;
    z-index: 30;
    padding-top: 18px;
    opacity: 0;
    visibility: hidden;
    top: -3000px;
    right: -58px;
    width: 360px;
  }

  .nav-user-wrapper.active{
    top: 18px;
    visibility: visible;
    opacity: 1;
    transition: opacity .15s ease-out;
  }

  .nav-user-wrapper .nav-user-list{
    position: relative;
    padding-top: 20px;
    background: #fff;
    border: 1px solid #d6d6d6;
    border-color: rgba(0,0,0,.08);
    border-radius: 8px;
    box-shadow: 0 20px 40px rgba(0,0,0,.15);
    z-index: 10;
  }
  .nav-user-wrapper>.nav-user-list {
    padding: 0;
    width: 100%;
  }
  .nav-user-wrapper .nav-user-list:before {
    position: absolute;
    content: " ";
    background: url(../assets/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) no-repeat -49px -43px;
    background-size: 240px 107px;
    width: 20px;
    height: 8px;
    top: -8px;
    margin-left: -10px;
  }
  .nav-user-wrapper>.nav-user-list:before {
    right: 160px;
  }

  .nav-user-list .full {
    border-radius: 8px;
    overflow: hidden;
  }
  @media (max-height: 780px){
    .nav-cart-items {
      max-height: 423px!important;
    }
  }
  @media (max-height: 900px){
    .nav-cart-items {
      max-height: 544px!important;
    }
  }

  @media (max-height: 1080px){
    .nav-cart-items {
      max-height: 620px!important;
    }
  }
  .nav-user-list .nav-cart-items {
    max-height: 363px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .nav-user-list .cart-item {
    height: 120px;
    width: 100%;
    overflow: hidden;
    border-top: 1px solid #f0f0f0;
  }
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
    line-height: 0;
    visibility: hidden;
  }
  .nav-user-list .cart-item:hover {
    background: #fcfcfc;
    .del {
      display: block;
    }
  }
  .nav-user-list li:first-child .cart-item:first-child {
    border-top: none;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }
  .nav-user-list .cart-item-inner {
    padding: 20px;
    position: relative;
  }
  .nav-user-list .item-thumb {
    position: relative;
    float: left;
    width: 80px;
    height: 80px;
    border-radius: 3px;
  }
  .nav-user-list .item-thumb:before{
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    border: 0 solid transparent;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
    border-radius: 3px;
  }
  .nav-user-list .item-thumb img {
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 3px;
    overflow: hidden;
  }
  .nav-user-list .item-desc {
    margin-left: 98px;
    display: table;
    width: 205px;
    height: 80px;
  }
  .nav-user-list .cart-cell {
    display: table-cell;
    vertical-align: middle;
  }
  .nav-user-list .item-desc h4 {
    color: #000;
    width: 185px;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 10px;
  }
  .nav-user-list .item-desc .attrs span {
    position: relative;
    display: inline-block;
    margin-right: 20px;
    font-size: 14px;
    line-height: 14px;
    color: #999;
  }
  .nav-user-list .item-desc h6 {
    color: #cacaca;
    font-size: 12px;
    line-height: 14px;
    margin-top: 20px;
  }
  .nav-user-list .item-desc h6 span {
    display: inline-block;
    font-weight: 700;
    color: #cacaca;
  }
  .nav-user-list .item-desc h6 .price-icon, .nav-user-list .item-desc h6 .price-num {
    color: #d44d44;
  }

  .nav-user-list .item-desc .attrs span:last-child {
    margin-right: 0;
  }
  .del-btn {
    display: block;
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: url(../assets/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) -50px -60px no-repeat;
    background-size: 240px 107px;
    text-indent: -9999em;
  }
  .nav-user-list .del{
    display: none;
    overflow: hidden;
    position: absolute;
    right: 20px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .nav-cart-total {
    box-sizing: content-box;
    position: relative;
    padding: 20px;
    height: 40px;
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
    border-radius: 0 0 8px 8px;
    box-shadow: inset 0 -1px 0 hsla(0,0%,100%,.5), 0 -3px 8px rgba(0,0,0,.04);
    background: linear-gradient(#fafafa,#f5f5f5);
  }
  .nav-cart-total p {
    margin-bottom: 4px;
    line-height: 16px;
    font-size: 12px;
    color: #c1c1c1;
  }
  .nav-cart-total h5 {
    line-height: 20px;
    font-size: 14px;
    color: #6f6f6f;
  }
  .nav-cart-total h6 {
    position: absolute;
    right: 20px;
    top: 25px;
    width: 108px;
  }
  .nav-cart-total h6 .to-cart{
    display: inline-block;
    padding: 6px 20px 6px 20px;
    border-radius: 6px;
    background: #2d8cf0;
    color: #fff;
    cursor: pointer;
  }
  .nav-cart-total h6 .to-cart a{
    color: #fff;
  }
  .nav-cart-total h5 span {
    font-size: 18px;
    color: #de4037;
    display: inline-block;
    font-weight: 700;
  }
  .nav-cart-total h5 span:first-child {
    font-size: 12px;
    margin-right: 5px;
  }


  .cart-con{
    text-align: center;
    position: relative;
  }
  .cart-con p {
    padding-top: 185px;
    color: #333;
    font-size: 16px;
  }
  .cart-con:before {
    position: absolute;
    content: " ";
    left: 50%;
    -webkit-transform: translate(-50%,-70%);
    transform: translate(-50%,-70%);
    top: 50%;
    width: 76px;
    height: 62px;
    background: url(../assets/cart-empty-new.png) no-repeat;
    background-size: cover;
  }


</style>
