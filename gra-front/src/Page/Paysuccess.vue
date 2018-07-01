<template>
  <div class="w" style="padding-bottom: 100px;">
    <v-header></v-header>
    <div class="page-payment">
      <div class="payment">
        <div class="payment-title">
          <h2>支付成功</h2>
        </div>
        <div class="payment-content">
          <p>恭喜你支付成功，总共花费 <span class="price"><em style="font-size: 30px">¥</em>{{totalPrice}}</span> 元</p>
          <div class="link">
            <router-link to="/order">
              <div >查看订单</div>
            </router-link>
            <router-link to="/">
              <div>继续选购</div>
            </router-link>
          </div>
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
        name: "paysuccess",
        data(){
          return{
            totalPrice:0
          }
        },
        components: {
          YShelf,
          VHeader,
          VFooter
        },
        created(){
          let query = this.$route.query
          this.totalPrice = query.price
        }
    }
</script>

<style scoped lang="scss">
  .page-payment {
    padding-top: 104px;
    width: 1220px;
    margin: 0 auto;
    padding-bottom: 20px;
    min-height: 600px;
    .payment {
      position: relative;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #dcdcdc;
      border-color: rgba(0, 0, 0, .14);
      box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);
      .payment-title {
        padding: 16px 32px;
        border-bottom: 1px solid #dddee1;
        border-radius: 10px 10px 0 0;
        background: #f8f8f9;
        font-size: 20px;
      }
      .payment-content{
        padding: 150px 0;
        font-size: 30px;
        text-align: center;
        span.price{
          color: #d44d44;
          font-weight: 700;
          line-height: 20px;
          text-align: right;
        }
        .link{
          margin-top: 20px;
          div{
            display: inline-block;
            width: 150px;
            height: 50px;
            line-height: 48px;
            font-size: 20px;
            border: 1px solid #5c81e3;
            border-radius: 4px;
            color: #fff;
            background-color: #678ee7;
            background-image: linear-gradient(180deg,#678ee7,#5078df);
          }
        }
      }
    }
  }
</style>
