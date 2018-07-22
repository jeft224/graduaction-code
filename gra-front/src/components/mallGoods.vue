<template>
  <div class="good-item">
    <div>
      <div class="good-img">
        <router-link :to="'goodsDetails?productId='+msg.productId">
          <img v-lazy="imageUrl" :alt="msg.productName">
        </router-link>
      </div>
      <h6 class="good-title">{{msg.productName}}</h6>
      <h3 class="sub-title ellipsis">{{msg.sub_title}}</h3>
      <div class="good-price pr">
        <div class="ds pa">
          <router-link :to="'goodsDetails?productId='+msg.productId">
            <div class="goods-detail">查看详情</div>
          </router-link>
          <div class="to-cart" @click="addCart(msg.productId)">加入购物车</div>
        </div>
        <p><span style="font-size: 16px">￥</span>
          {{msg.salePrice}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api'
  import { mapMutations, mapState } from 'vuex'
  import {IsVersion} from '../utils/enviroment.js'

  export default {
    props: {
      msg: {type: [Object, Array]}
    },
    data () {
      return {
       
      }
    },
    methods: {
      goodsDetails (id) {
        this.$router.push({path: 'goodsDetails/productId=' + id})
      },
      addCart(id){
        if(!this.token){
          this.$Message.success("请登录！！！");
          this.$router.push({name:'login'})
        }else{
          this.$Loading.start();
          api.addCart({productId: id, productNum: 1}).then((res)=>{
            if(res.data.code===1){
              this.$store.dispatch('SetCartList',res.data.result);
              this.$Message.success(res.data.message);
              this.$Loading.finish();
            }else{
              this.$Message.success(res.data.message);
              this.$Loading.finish();
            }
          })
        }
      }
    },
    computed: {
      ...mapState(['token']),
      imageUrl() {
        console.log(this.msg.productImageSmall[0])
        return IsVersion(this.msg.productImageSmall[0]);
      }
    },
    components: {
      // YButton
    }
  }
</script>
<style lang="scss"  scoped>
  .good-item {
    background: #fff;
    width: 25%;
    transition: all .5s;
    height: 430px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
      .good-price p {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
    .ds {
      /*display: flex;*/
      align-items: center;
      justify-content: center;
      width: 100%;
      display: none;
    }
    .good-img {
      img {
        margin: 50px auto 10px;
        width: 200px;
        height: 200px;
        display: block;
      }
    }
    .good-price {
      margin: 15px 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #e4393c;
      font-size: 20px;
    }
    .good-title {
      line-height: 1.2;
      font-size: 16px;
      color: #424242;
      margin: 0 auto;
      padding: 0 14px;
      text-align: center;
      overflow: hidden;
    }
    h3 {
      text-align: center;
      line-height: 1.2;
      font-size: 12px;
      color: #d0d0d0;
      padding: 10px;
    }
  }
  .goods-detail,.to-cart{
    display: inline-block;
    padding: 4px 10px;
    border-radius: 2px;
    background: #b3b6b8;
    color: #fff;
    cursor: pointer;
    margin-left: 6px;
  }
</style>
