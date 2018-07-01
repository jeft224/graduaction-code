<template>
  <div class="w" style="padding-bottom: 100px;">
    <v-header></v-header>
    <div class="page-payment">
      <div class="payment">
        <div class="payment-title">
          <h2>支付订单</h2>
        </div>
        <div class="payment-content">
          <div class="box-inner order-info">
            <h3>提交订单成功</h3>
            <p class="payment-detail">请在 <span>24 小时内</span>完成支付，超时订单将自动取消。</p>
            <p class="payment-detail">我们将在您完成支付后的 72 小时内发货</p>
          </div>
          <!--支付方式-->
          <div class="pay-type">
            <div class="p-title">支付方式</div>
            <div class="pay-item">
              <div :class="{active:payType==1}" @click="payType=1"><img src="../assets/alipay@2x.png" alt=""></div>
              <div :class="{active:payType==2}" @click="payType=2"><img src="../assets/weixinpay@2x.png" alt=""></div>
            </div>
          </div>

          <div class="box-inner">
            <div>
              <span>应付金额:</span>
              <em><span>¥</span>{{checkPrice}}</em>
              <div class="pay" @click="paySuc()">立刻支付</div>
            </div>
          </div>
        </div>
      </div>
      <div class="order-list">
        <div class="confirm-detail">
          <div class="info-title">收货信息</div>
          <p class="info-detail">姓名：{{addList.receiverName}}</p>
          <p class="info-detail">联系电话：{{addList.receiverPhone}}</p>
          <p class="info-detail">详细地址：{{addList.receiverAddress}}</p>
        </div>
        <div class="confirm-table-title">
          <span class="name">商品信息</span>
          <div>
            <span class="subtotal">小计</span>
            <span class="num">数量</span>
            <span class="price">单价</span>
          </div>
        </div>
        <div class="confirm-goods-table">
          <div class="cart-items" v-for="(item,i) in cartList" :key="i" v-if="item.checked === '1'">
            <div class="name">
              <div class="name-cell ellipsis">
                <a href="javascript:;" title=""
                   target="_blank">{{item.productName}}</a></div>
            </div>
            <div class="n-b">
              <div class="subtotal ">
                <div class="subtotal-cell"> ¥ {{item.productPrice * item.productNum}}<br></div>
              </div>
              <div class="goods-num ">{{item.productNum}}</div>
              <div class="price ">¥ {{item.productPrice}}</div>
            </div>
          </div>
        </div>
        <div class="order-discount-line"><p> 商品总计： <span>¥ {{checkPrice}}</span></p>
          <p> 运费： <span>+ ¥ 0.00</span></p>
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import YShelf from '../components/shelf'
  import VHeader from '../components/VHeader'
  import VFooter from '../components/VFooter'
  import {mapState,mapMutations} from 'vuex'
  import api from '../api'
    export default {
        name: "payment",
        data(){
            return{
              payType:1,
              cartList:[],
              addList: {},
              addressId: 0,
              productId: '',
              num: ''
            }
        },
        computed: {
          // 选中的总价格
          checkPrice () {
            let totalPrice = 0
            this.cartList && this.cartList.forEach(item => {
              if (item.checked === '1') {
                totalPrice += (item.productNum * item.productPrice)
              }
            })
            return totalPrice
          }
        },
        components: {
          YShelf,
          VHeader,
          VFooter
        },
        methods:{
          //查询商品
          productDet(productId){
            api.getGoodsById(productId).then((res)=>{
              let item = res.data.result.good;
              let cart = {
                checked:'1',
                productImg:item.productImageSmall[0],
                productNum:this.num,
                productName:item.productName,
                productPrice:item.salePrice
              }
              this.cartList.push(cart);
            })
          },
          //查询购物车
          getCartList(){
            api.getAllCart().then((res)=>{
              this.cartList = res.data.result;
            })
          },
          // 查询收货信息
          getAdddressList(params){
              api.queryAddressById(params).then((res)=>{
                this.addList = res.data.result
              })
          },
          //生成订单
          paySuc () {
            api.payMent({
              addressId: this.addressId,
              orderTotal: this.checkPrice,
              productId: this.productId,
              productNum: this.num
            }).then(res => {
              // console.log(res)
              if (res.data.code===1) {
                // this.$Message.error(res.data.message)
                this.$router.push({path: '/paysuccess', query: {price: this.checkPrice}})
              } else {
                this.$Message.error(res.data.message)
              }
            })
          },
        },
        created(){
          let query = this.$route.query
          this.addressId = query.addressId
          if (this.addressId) {
            this.getAdddressList(this.addressId)
            if (query.productId && query.num) {
              this.productId = query.productId
              this.num = query.num
              this.productDet(this.productId)
            } else {
              this.getCartList()
            }
          } else {
            this.$router.push({path: '/'})
          }
        }
    }
</script>

<style scoped lang="scss">
  .page-payment{
    padding-top: 104px;
    width: 1220px;
    margin: 0 auto;
    padding-bottom: 20px;
    min-height: 600px;
    .payment{
      position: relative;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #dcdcdc;
      border-color: rgba(0,0,0,.14);
      box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
      .payment-title{
        padding: 16px 32px;
        border-bottom: 1px solid #dddee1;
        border-radius: 10px 10px 0 0;
        background: #f8f8f9;
        font-size: 20px;
      }
      .payment-content{
        .order-info {
          padding: 60px 0 55px;
          color: #333;
          background: #fff!important;
          h3 {
            padding-bottom: 14px;
            line-height: 36px;
            text-align: center;
            font-size: 36px;
            color: #212121;
          }
          .payment-detail{
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            color: #999;
          }
        }
        .box-inner{
          line-height: 60px;
          background: #f9f9f9;
          border-top: 1px solid #e5e5e5;
          box-sizing: border-box;
          div{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 20px;
          }
          em{
            margin-left: 5px;
            font-size: 24px;
            color: #d44d44;
            font-weight: 700;
            margin-right: 10px;
          }
          .pay{
            height: 40px;
            font-size: 16px;
            line-height: 38px;
            border: 1px solid #5c81e3;
            border-radius: 4px;
            color: #fff;
            background-color: #678ee7;
            background-image: linear-gradient(180deg,#678ee7,#5078df);
            cursor: pointer;
          }
        }

      }
    }
    .pay-type{
      margin: 0 auto;
      width: 90%;
      padding-bottom: 30px;
      .p-title{
        font-size: 18px;
        line-height: 40px;
        padding: 0 10px;
        position: relative;
        &:before{
          content: " ";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-bottom: 1px solid #ccc;
        }
      }
      .pay-item{
          display: flex;
          align-items: center;
          div{
            @extend .pay-item;
            margin-top: 20px;
            width: 175px;
            height: 50px;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            border: 1px solid #e5e5e5;
            cursor: pointer;
            border-radius: 6px;
            margin-right: 10px;
            background: #fafafa;
            img{
              display: block;
              height: 34px;
              margin: 8px auto;
            }
          }
          .active{
            border-color: #6a8fe5;
            background: #fff;
          }
      }
    }
    .order-list{
      margin-top: 20px;
      .confirm-detail{
        padding: 25px 30px ;
        border-top: 1px solid #d5d5d5;
        /*background: #d5d5d5;*/
        .info-title{
          height: 14px;
          margin-bottom: 17px;
          line-height: 14px;
          font-weight: bolder;
          color: #333;
        }
        .info-detail{
          line-height: 24px;
          color: #666;
        }
      }
      .confirm-table-title{
        padding: 3px 0 0 30px;
        border-top: 1px solid #d5d5d5;
        line-height: 54px;
        font-weight: bolder;
        color: #000;
        display: flex;
        justify-content: space-between;
        span{
          display: inline-block;
          width: 175px;
          text-align: center;
        }
      }
      .confirm-goods-table{
        border-top: 1px solid #d5d5d5;
        .cart-items{
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .name{
            width: 40%;
            padding-left: 80px;
            .ellipsis {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          a{
            color: #333;
          }
          .n-b{
            display: flex;
            justify-content: center;
            align-items: center;
            div{
              color: #626262;
              font-weight: 700;
              width: 175px;
              text-align: center;
            }
          }
        }
      }
      .order-discount-line{
        padding: 22px 30px 53px;
        border-top: 1px solid #d5d5d5;
        line-height: 24px;
        text-align: right;
        font-size: 12px;
      }
    }

  }
</style>
