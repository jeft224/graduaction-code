<template>
    <div style="background: #ededed;">
      <v-header></v-header>
      <div  class="page-order">
        <div class="order">
          <div class="order-title">
            <h2>我的订单</h2>
          </div>
          <div class="order-content" v-if="orderList.length">
            <div v-for="(item,i) in orderList" :key="i">
              <div class="pr">
                <div class="cart" v-for="(good,j) in item.goodsList" :key="j">
                  <div class="gray-sub-title cart-title">
                    <div class="first">
                      <div>
                        <span class="date" v-text="item.orderTime"></span>
                        <span class="order-id"> 订单号： <a href="javascript:;">{{item.orderId}}</a> </span>
                      </div>
                      <div class="f-bc">
                        <span class="price">单价</span>
                        <span class="num">数量</span>
                        <span class="operation">小计</span>
                      </div>
                    </div>
                    <div class="last">
                      <span class="sub-total">实付金额</span>
                      <span class="order-detail"> <a href="javascript:;">查看详情<em class="icon-font"></em></a> </span>
                    </div>
                  </div>
                  <div class="cart-content">
                    <div class="cart-l" :class="{bt:j>0}">
                      <div class="car-l-l">
                        <div class="img-box"><img
                          :src="good.productImg"
                          alt=""></div>
                        <div class="ellipsis">{{good.productName}}</div>
                      </div>
                      <div class="cart-l-r">
                        <div>¥ {{good.productPrice}}</div>
                        <div class="num">{{good.productNum}}</div>
                        <div class="num">{{good.productNum*good.productPrice}}</div>
                      </div>
                    </div>
                    <div class="cart-r">
                      <span>¥ {{good.productPrice}}</span>
                      <span>{{item.orderStatus === '1' ? '未支付' : '已支付'}} </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
          <div v-else class="cart-empty">
            <div class="cart-e"></div>
            <p  style="text-align: center; padding: 20px; color: rgb(141, 141, 141);">你的订单空空如也</p>
          </div>
        </div>
      </div>
      <v-footer></v-footer>
    </div>
</template>

<script>
  import VHeader from '../components/VHeader'
  import VFooter from '../components/VFooter'
  import api from '../api'
  import {mapState} from 'vuex'
    export default {
        name: "order",
        components:{
          VHeader,
          VFooter
        },
        data(){
          return {
            orderList:[

            ]
          }
        },
        computed:{
          ...mapState({token:'token'})
        },
        mounted(){
          if(!this.token){
            this.$router.push({name:'login'})
          }
          api.getOrderList().then((data) =>{
            // console.log(arguments)
            // console.log(data.data.result);
            this.orderList = data.data.result
          })
        }
    }
</script>

<style scoped lang="scss">
  .page-order{
    padding-top: 104px;
    width: 1220px;
    margin: 0 auto;
    padding-bottom: 20px;
    min-height: 600px;
  }
  .order{
    position: relative;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
  }
  .order-title{
    padding: 16px 32px;
    border-bottom: 1px solid #dddee1;
    border-radius: 10px 10px 0 0;
    background: #f8f8f9;
    font-size: 20px;
  }
  .gray-sub-title {
    height: 38px;
    padding: 0 24px;
    background: #eee;
    border-top: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    line-height: 38px;
    font-size: 12px;
    color: #666;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .gray-sub-title .first {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }
  .gray-sub-title .first .date {
    padding-left: 6px;
  }
  .gray-sub-title .first .order-id{
    margin-left: 20px;
  }
  .gray-sub-title span{
    display: inline-block;
    height: 100%;
  }
  .gray-sub-title .first .f-bc>span {
    width: 112px;
    text-align: center;
  }
  .gray-sub-title .last span {
    flex: 1;
  }

  .gray-sub-title .last{
    width: 230px;
    text-align: center;
    display: flex;
    border-left: 1px solid #ccc;
  }
  .pr {
    position: relative;
  }
  .cart {
    display: flex;
    justify-content: space-between;
    /*padding: 0 24px;*/
    flex-direction: column;
  }
  .cart .cart-content{
    flex: 1;
    display: flex;
    position: relative;
    padding: 0 24px;
  }
  .cart .cart-l {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 15px 0px;
    justify-content: space-between;
    position: relative;
  }
  .cart .cart-l:before {
    position: absolute;
    content: " ";
    right: -1px;
    top: 0;
    width: 1px;
    background-color: #efefef;
    height: 100%;
  }
  .cart .cart-l .car-l-l {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .cart .cart-l .img-box {
    border: 1px solid #ebebeb;
  }
  .cart .cart-l img{
    display: block;
    width: 80px;
    height: 80px;
  }
  .cart .cart-l .ellipsis {
    margin-left: 20px;
    width: 220px;
  }
  .cart .cart-l .cart-l-r {
    display: flex;
  }
  .cart .cart-l .cart-l-r>div {
    text-align: center;
    width: 112px;
  }
  .cart .cart-r {
    width: 230px;
    display: flex;
    text-align: center;
    align-items: center;
  }
  .cart .cart-r>span{
    flex: 1;
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
</style>
