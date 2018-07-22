<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(item, i) in small" :key="i" :class="{on:big===item}" @click="big=item">
                <img :src="item" :alt="product.productName">
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <img :src="big" :alt="product.productName">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{product.productName}}</h4>
          <h6>
            <span>{{product.sub_title}}</span>
            <span class="price">
              <em>¥</em><i>{{product.salePrice}}</i></span>
          </h6>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
            <div>
              <span data-v-02e65737="" class="cart-control-minus" @click="minus()">-</span>
              {{ productNum }}
              <span data-v-02e65737="" class="cart-control-add" @click="add()">+</span>
            </div>
        </div>
        <div class="buy">
          <div class="to-cart" @click="addCart(product.productId)">加入购物车</div>
          <button class="to-buy" @click="checkout(product.productId)">现在购买</button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <div class="img-item" v-if="productMsg">
            <img v-for="(item, i) in productMsg"
                 :src="item"
                 alt="产品信息"
                 :key="i"
            >
          </div>
          <div class="no-info" v-else>
            该产品暂无内容
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
</template>
<script>
  import api from '../api'
  import { mapMutations, mapState } from 'vuex'
  import YShelf from '../components/shelf'
  import {IsVersion} from '../utils/enviroment.js'

  export default {
    data () {
      return {
        productMsg: {},
        small: [],
        big: '',
        product: {},
        productNum: 1
      }
    },
    computed: {
      ...mapState({token:'token'})
    },
    methods: {
      add(){
        this.productNum+= 1
      },
      minus(){
        if(this.productNum<=1){
          this.productNum=1
        }else{
          this.productNum-= 1
        }
      },
      addCart(id){
        if(!this.token){
          this.$Message.success("请登录！！！");
          this.$router.push({name:'login'})
        }else{
          this.$Loading.start();
          api.addCart({productId: id, productNum: this.productNum}).then((res)=>{
            this.$store.dispatch('SetCartList',res.data.result);
            this.$Message.success(res.data.message);
            this.$Loading.finish();
          })
        }
      },
      checkout (productId) {
        this.$router.push({path: '/checkout', query: {productId, num: this.productNum}})
      },
    },
    components: {
      YShelf
    },
    created () {
      let id = this.$route.query.productId
      // console.log(id);
      api.getGoodsById(id).then((res)=>{
        let result = res.data.result
        this.product = result.good
        this.productMsg = IsVersion(result.good.productImageSmall) || ''
        this.small=IsVersion(result.good.productImageSmall)
        this.big = IsVersion(result.good.productImageSmall[0])
      })
    }
  }
</script>
<style lang="scss" scoped>
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
  .to-buy,.to-cart{
    display: inline-block;
    padding: 10px 30px;
    border-radius: 3px;
    background: #b3b6b8;
    color: #fff;
    cursor: pointer;
    margin-left: 6px;
  }
  .to-cart{
    background: #1959d1;
  }
  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }
  .gray-box {
    display: flex;
    padding: 60px;
    margin: 20px 0;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            width: 80px;
            height: 80px;
            margin-top: 10px;
            padding: 12px;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            width: 400px;
            height: 400px;
          }
        }
      }
    }
    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }
  .item-info {
    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }
  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }
  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>
