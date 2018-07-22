<template>
  <div style="background: #ededed;">
    <v-header></v-header>
    <div class="page-cart">
      <div class="cart">
        <div class="cart-title"><h2>购物清单</h2></div>
        <!--购物车内容-->
        <div class="cart-content" v-if="cartList.length">
          <div class="cart-content-header">
            <div class="cart-info">商品信息</div>
            <div class="cart-delete">操作</div>
            <div class="cart-cost">小计</div>
            <div class="cart-count">数量</div>
            <div class="cart-price">单价</div>
          </div>
          <div class="cart-content-main clearfix" v-for="(item, index) in cartList" :key="index">
            <div  class="cart-choose">
              <span  class="blue-checkbox-new " :class="{'checkbox-on':item.checked === '1'}" @click="editCart('check',item)"></span></div>
            <div class="cart-info f1">
              <img :src="item.productImg" alt="item.productImg">
              <span class="icon-img"></span>
            </div>
            <div class="cart-name f1">
              <span>{{ item.productName }}</span>
            </div>
            <div style="float: right;">
              <div class="cart-price">¥ {{ item.productPrice }}</div>
              <div class="cart-count">
                <span class="cart-control-minus" @click="minus(item.productId,item.productNum,item.checked)">-</span>
                {{ item.productNum }}
                <span class="cart-control-add" @click="add(item.productId,item.productNum,item.checked)">+</span>
              </div>
              <div class="cart-cost">¥ {{ item.productPrice * item.productNum }}</div>
              <div class="cart-delete">
                <a class="cart-delete-btn" @click="cartdel(item.productId)"></a>
              </div>
            </div>

          </div>
        </div>
        <div v-else class="cart-empty">
          <div class="cart-e"></div>
          <p  style="text-align: center; padding: 20px; color: rgb(141, 141, 141);">你的购物车空空如也</p>
          <div style="text-align: center">
            <router-link to="/goodlist">
              <button>现在选购</button>
            </router-link>
          </div>
        </div>
        <div class="cart-footer" v-show="cartList.length">
          <div class="cart-footer-checkAll">
            <div class="choose-all">
              <span class="blue-checkbox-new" :class="{'checkbox-on':checkAllFlag}" @click="editCheckAll"></span>全选
            </div>
            <div class="delete-choose-goods">删除选中的商品</div>
          </div>
          <div class="shopping">
            <div class="cart-footer-desc">
              共计 <span>{{ checkNum?checkNum:0}}</span> 件商品
            </div>
            <div class="cart-footer-desc">
              应付总额 <span>¥ {{checkPrice }}</span>
            </div>
            <div class="cart-footer-desc">
              <div class="cart-control-order" @click="checkout()">现在结算</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
    import VHeader from '../components/VHeader'
    import VFooter from '../components/VFooter'
    import {mapState,mapMutations} from 'vuex'
    import api from '../api'
    export default {
        name: "cart",
        data(){
          return {
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
            productDictList:[
              {
                orderId:'111111',
                createDate:'2018-03-16 17:14:49',
                goodsList:[
                  {
                    "productId":"100032701",
                    "productImg":"http://image.smartisanos.cn/resource/41cb562a47d4831e199ed7e2057f3b61.jpg",
                    "productName":"极米无屏电视 CC",
                    "checked":"1",
                    "productNum":2,
                    "productPrice":2799,
                    "_id":"5aab33a5ab948846fbb23d58"
                  },
                  {
                    "productId":"100032701",
                    "productImg":"http://image.smartisanos.cn/resource/41cb562a47d4831e199ed7e2057f3b61.jpg",
                    "productName":"极米无屏电视 CC",
                    "checked":"1",
                    "productNum":2,
                    "productPrice":2799,
                    "_id":"5aab33a5ab948846fbb23d58"
                  }
                ],
                orderTotal:5998,
                orderStatus:1
              }
            ]
          }
        },
        components:{
          VHeader,
          VFooter
        },
        methods: {
          ...mapMutations([ 'EDIT_CART' ]),
          //编辑购物车
          editCart(type, item) {
            if (type && item) {
              let checked = item.checked
              let productId = item.productId
              let productNum = item.productNum
              // 勾选
              if (type === 'check') {
                let newChecked = checked === '1' ? '0' : '1'
                //this._cartEdit(productId, productNum, newChecked)
                this.cartList.map((item) => {
                  if (item.productId === productId) {
                    item.checked = newChecked
                  }
                })
              }
            } else {
              console.log('缺少所需参数')
            }
          },
          // 全选
          editCheckAll () {
            let checkAll = !this.checkAllFlag
            // editCheckAll({checkAll: checkAll}).then(res => {
            //   this.EDIT_CART({checked: checkAll})
            // })
          },
          midEditcart(productId, productNum, checked){
            api.editCart({productId,productNum,checked}).then((res)=>{
                if(res.data.code === 1){
                  this.EDIT_CART({productId,productNum,checked});
                }
            })
          },
          //数量减少
          minus(productId,productNum,checked){
              let num = productNum ;
              if(num<=1){
                num =1
              }else{
                num -= 1;
              }
              this.midEditcart(productId,num,checked);
          },
          //数量增多
          add(productId,productNum,checked){
            let num = productNum ;
            num += 1;
            this.midEditcart(productId,num,checked);
          },
          //删除购物车
          cartdel (productId) {
            api.deleteCart({productId}).then(res => {
              this.EDIT_CART({productId})
            })
          },
          checkout(){
            this.$router.push({path:'/checkout'})
          }
        },
        computed:{
          // 是否全选
          checkAllFlag () {
            return this.checkedCount === this.cartList.length
          },
          // 勾选的数量
          checkedCount () {
            var i = 0
            this.cartList && this.cartList.forEach((item) => {
              if (item.checked === '1') i++
            })
            return Number(i)
          },
          // 计算总数量
          totalNum () {
            var totalNum = 0
            this.cartList && this.cartList.forEach(item => {
              totalNum += (item.productNum)
            })
            return Number(totalNum)
          },
          // 选中的总价格
          checkPrice () {
            var totalPrice = 0
            this.cartList && this.cartList.forEach(item => {
              if (item.checked === '1') {
                totalPrice += (item.productNum * item.productPrice)
              }
            })
            return totalPrice
          },
          // 选中的商品数量
          checkNum () {
            var checkNum = 0
            this.cartList && this.cartList.forEach(item => {
              if (item.checked === '1') {
                checkNum += (item.productNum)
              }
            })
            return checkNum
          },
          ...mapState({cartList:'cartList'})
        }

    }
</script>

<style scoped lang="scss">
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
    line-height: 0;
    visibility: hidden;
  }
  .page-cart{
    padding-top: 104px;
    width: 1220px;
    margin: 0 auto;
    padding-bottom: 20px;
    min-height: 600px;
    /*background: #fff;*/
  }
  .page-cart .blue-checkbox-new{
    float: left;
    margin-right: 9px;
  }
  .page-cart .blue-checkbox-new {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    background: url(../assets/checkbox-new_631a56a4f6.png) no-repeat 0 -20px;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
  }
  .page-cart .blue-checkbox-new.checkbox-on{
    background: url(../assets/checkbox-new_631a56a4f6.png) no-repeat 0 0;
  }
  .cart{
    position: relative;
    background: #fff;
    /*border: 1px solid #dddee1;*/
    border-radius: 10px;
    overflow: hidden;
    /*background: #fff;*/
    /*border-radius: 8px;*/
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
  }
  .cart-title{
    padding: 16px 32px;
    border-bottom: 1px solid #dddee1;
    border-radius: 10px 10px 0 0;
    background: #f8f8f9;
    font-size: 20px;
  }
  .cart-content-header{
    /*padding: 8px 32px;*/
    /*overflow: hidden;*/
    /*border-bottom: 1px solid #dddee1;*/
    /*background: #eee;*/
    /*position: relative;*/
    z-index: 1;
    line-height: 38px;
    height: 38px;
    padding: 0 0 0 30px;
    font-size: 12px;
    background: #eee;
    border-bottom: 1px solid #dbdbdb;
    border-bottom-color: rgba(0,0,0,.08);
  }
  .cart-empty{
    padding: 50px;
    button{
      width: 150px;
      height: 40px;
      line-height: 38px;
      color: #8d8d8d;
      box-shadow: #bebebe 1px 1px 5px 1px;
      cursor: pointer;
      transition: color 2s ease;
      &:hover{
        color: #000;
      }
    }
  }
  .cart-e{
    overflow: hidden;
    margin: 0 auto;
    background: url(../assets/cart-empty_@2x.png) no-repeat;
    width: 275px;
    height: 300px;
    color: #8d8d8d;
  }
  .cart-content-header div{
    width: 137px;
    float: right;
    text-align: center;
    color: #838383;
  }
  .cart-content-header .cart-info{
    text-align: left;
    float: left;
    font-size: 14px;
  }
  .cart-content-main .cart-choose{
    position: absolute;
    left: -74px;
    top: 0;
    width: 74px;
    height: 20px;
    padding: 60px 0 0 31px;
    font-size: 12px;
    color: #999;
  }
  .cart-content-main{
    line-height: 140px;
    border-top: none;
    border-bottom: 1px dashed #e9eaec;
    height: 140px;
    margin-left: 74px;
    position: relative;
  }
  .cart-content-main .f1{
    float: left;
  }
  .cart-content-main .cart-info{
    position: relative;
    margin-top: 30px;
    overflow: hidden;
    width: 80px;
    height: 80px;
  }
  .cart-content-main img{
    width: 80px;
    height: 80px;
    position: relative;
    top: 0px;
  }
  .cart-content-main .cart-info .icon-img{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 3px;
    border: 0 solid hsla(0,0%,100%,.1);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.06);
  }
  .cart-content-main .cart-name{
    width: 380px;
    margin-left: 20px;
    color: #323232;
    display: table-cell;
    vertical-align: middle;
    height: 140px;
  }
  .cart-content-main .cart-name span{
    color: #333;
    font-size: 16px;
  }
  .cart-content-main .cart-price,.cart-content-main .cart-count,.cart-content-main .cart-delete,.cart-content-main .cart-cost{
    width: 137px;
    text-align: center;
    color: #666;
    line-height: 140px;
    float: left;
  }
  .cart-control-minus, .cart-control-add{
    display: inline-block;
    margin: 0 4px;
    width: 24px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    background: #f8f8f9;
    border-radius: 50%;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    cursor: pointer;
  }
  .cart-control-minus:hover, .cart-control-add:hover{
    box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.2);
  }
  .cart-content-main .cart-delete{
    padding: 58px 0 0;
    font-size: 12px;
  }
  .cart-content-main .cart-delete .cart-delete-btn{
    display: block;
    width: 24px;
    height: 24px;
    margin: 0 auto;
    color: #c2c2c2;
    background: url(../assets/delete-btn-icon_a35bf2437e@2x.jpg);
    background-size: 100% auto;
    transition: none;
  }
  .cart-content-main .cart-delete .cart-delete-btn:hover{
    color: #666;
  }
  .cart-control-delete{
    cursor: pointer;
    color: #2d8cf0;
  }
  .cart-promotion{
    padding: 16px 32px;
  }
  .cart-control-promotion, .cart-control-order{
    display: inline-block;
    padding: 8px 32px;
    border-radius: 6px;
    background: #2d8cf0;
    color: #fff;
    cursor: pointer;
  }
  .cart-control-promotion{
    padding: 2px 6px;
    font-size: 12px;
    border-radius: 3px;
  }
  .cart-footer{
    /*padding: 32px;*/
    /*text-align: right;*/
    height: 90px;
    width: 100%;
    z-index: 1;
    background-position: 50%;
    background: #fdfdfd;
    background: linear-gradient(#fdfdfd,#f9f9f9);
    border-top: 1px solid #e9e9e9;
    box-shadow: 0 -3px 8px rgba(0,0,0,.04);
  }
  .cart-footer-checkAll{
    float: left;
    padding: 35px 26px;
    font-size: 12px;
  }
  .cart-footer-checkAll .choose-all,.cart-footer-checkAll .delete-choose-goods{
    float: left;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
    position: relative;
  }
  .shopping{
    float: right;
    padding: 30px 30px 0 30px;
  }
  .cart-footer-desc{
    display: inline-block;
    padding: 0 16px;
  }
  .cart-footer-desc span{
    color: #f2352e;
    font-size: 20px;
  }
</style>
