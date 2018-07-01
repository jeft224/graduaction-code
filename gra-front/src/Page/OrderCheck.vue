<template>
  <div style="background: #ededed;">
    <v-header></v-header>
    <div class="page-address">
      <div class="address">
        <div class="address-title"><h2>收货信息</h2></div>
        <div class="address-content">
          <ul class="address-item-list clearfix">
            <li class="address " v-for="(item,i) in addressList"  :key="i"
                :class="{checked:addressId === item._id}"
                @click="defaultAddress(item._id)">
              <span  class="pa" v-if="addressId === item._id">
               <svg viewBox="0 0 1473 1024" width="17.34375" height="12">
               <path
                 d="M1388.020 57.589c-15.543-15.787-37.146-25.569-61.033-25.569s-45.491 9.782-61.023 25.558l-716.054 723.618-370.578-374.571c-15.551-15.769-37.151-25.537-61.033-25.537s-45.482 9.768-61.024 25.527c-15.661 15.865-25.327 37.661-25.327 61.715 0 24.053 9.667 45.849 25.327 61.715l431.659 436.343c15.523 15.814 37.124 25.615 61.014 25.615s45.491-9.802 61.001-25.602l777.069-785.403c15.624-15.868 25.271-37.66 25.271-61.705s-9.647-45.837-25.282-61.717M1388.020 57.589z"
                 fill="#6A8FE5" p-id="1025">
                 </path>
               </svg>
             </span>
              <p>收货人: {{item.receiverName}} {{item.isDefault ? '(默认地址)' : ''}}</p>
              <p class="street-name ellipsis">收货地址:{{item.receiverAddress}}</p>
              <p>手机号码: {{item.receiverPhone}}</p>
              <div class="operation-section">
                <span class="update-btn" @click="update(item)">修改</span>
                <span class="delete-btn" @click="deleteAddress(item._id)">删除</span>
              </div>
            </li>
            <li class="add-address-item" @click="show()">
              <img src="../../static/jia.svg" alt="">
              <p>使用新地址</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="page-cart">
      <div class="cart">
        <div class="cart-title"><h2>购物清单</h2></div>
        <!--购物车内容-->
        <div class="cart-content" v-if="cartList.length">
          <div class="cart-content-header">
            <div class="cart-info">商品信息</div>
            <div class="cart-cost">小计</div>
            <div class="cart-count">数量</div>
            <div class="cart-price">单价</div>
          </div>
          <div class="cart-content-main clearfix" v-for="(item, index) in cartList">
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
                {{ item.productNum }}
              </div>
              <div class="cart-cost">¥ {{ item.productPrice * item.productNum }}</div>
            </div>

          </div>
        </div>
        <div v-else class="cart-empty">
          <div class="cart-e"></div>
          <p data-v-1268c7cc="" style="text-align: center; padding: 20px; color: rgb(141, 141, 141);">你的购物车空空如也</p>
          <div style="text-align: center">
            <router-link to="/goods">
              <button>现在选购</button>
            </router-link>
          </div>
        </div>
        <div class="cart-footer" v-show="cartList.length">
          <div class="shopping">
            <div class="cart-footer-desc">
              应付总额 <span>¥ {{checkPrice }}</span>
            </div>
            <div class="cart-footer-desc">
              <div class="cart-control-order" @click="payment()">提交订单</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="modal" width="450">
      <p slot="header" style="color:#f60;text-align:center;font-size: 18px; font-weight: 400;">
        <Icon type="ios-plus-outline" v-if="!status"></Icon>
        <Icon type="edit" v-else></Icon>
        <span>{{title}}</span>
      </p>
      <Form ref="address" :model="address" :label-width="100" >
        <Form-item label="收货人姓名：" prop="receiverName">
          <Input  type="text" placeholder="收货人姓名" v-model="address.receiverName"/>
        </Form-item>
        <Form-item label="收货人电话：" prop="receiverPhone">
          <Input  type="text" placeholder="收货人电话" v-model="address.receiverPhone"/>
        </Form-item>
        <Form-item label="收货人地址：" prop="receiverAddress">
          <Input  type="text" placeholder="收货人地址" v-model="address.receiverAddress"/>
        </Form-item>
        <Form-item prop="isDefault" label-width='0' style="margin-left:15px;margin-bottom: 0px;">
          <Checkbox v-model="address.isDefault">设为默认</Checkbox>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="success" size="large" long @click="saveAddress()" >保存</Button>
      </div>
    </Modal>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import VHeader from '../components/VHeader'
  import VFooter from '../components/VFooter'
  import {mapState,mapMutations} from 'vuex'
  import api from '../api'
    export default {
      name:'checkout',
      data(){
        return{
          cartList:[],
          addressList:[],
          num:'',
          productId:'',
          modal:false,
          title:"",
          status:false,
          addressId:'1',
          address:{},
          width:100
        }
      },
      components:{
        VHeader,
        VFooter
      },
      mounted(){
        this.queryAddress();
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
        // 添加地址
        saveAddress(){
          if(this.address._id){
           api.editAddress(this.address).then((res)=>{
             if(res.data.code===1){
               this.$Message.success(res.data.message)
             }else{
               this.$Message.error(res.data.message)
             }
           })
          }else{
            api.saveAddress(this.address).then((res)=>{
              if(res.data.code===1){
                this.$Message.success(res.data.message)
              }else{
                this.$Message.error(res.data.message)
              }
            })
          }
          this.modal=false;
          this.queryAddress();
        },
        // 查询收货信息
        queryAddress(){
          api.queryAddressByUserId().then((res)=>{
            let data = res.data.result
            if (data.length) {
              this.addressList = data
              this.addressId = data[0]._id || '1'
            } else {
              this.addressList = []
            }
          })
        },
        update(item){
          if(item){
            this.title="管理收货地址"
            this.status = true
            this.modal=true;
            this.queryAddressById(item._id)
          }
        },
        //删除收货人信息
        deleteAddress(id){
          api.deleteAddress({_id:id}).then((res)=>{
            if(res.data.code===1){
              this.$Message.success(res.data.message)
            }else{
              this.$Message.error(res.data.message)
            }
          })
          this.queryAddress();
        },
        // 根据id查询收货人信息
        queryAddressById(id){
          api.queryAddressById(id).then((res)=>{
              this.address=res.data.result;
          })
        },
        defaultAddress(id){
          this.addressId = id;
        },
        show(){
          this.modal=true
          this.title="新增收货地址";
          this.address = {};
        },
        payment(){
          if(this.addressId === '1'){
            this.$Message.error("收货地址不能为空!")
            return;
          }
          this.$router.push({
            path: '/payment',
            query: {
              'addressId': this.addressId,
              'productId': this.productId,
              'num': this.num
            }
          })
        }
      },
      computed:{
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
      },
      created(){
        let query = this.$route.query;
        if(query.productId&&query.num){
          this.productId = query.productId;
          this.num = query.num;
          this.productDet(this.productId)
        }else{
          this.getCartList()
        }
      }
    }
</script>

<style scoped lang="scss">
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
    height: 0;
    line-height: 0;
    visibility: hidden;
  }
  .page-cart{
    padding-top: 60px;
    width: 1220px;
    margin: 0 auto;
    padding-bottom: 20px;
    min-height: 600px;
  }
  .page-address{
    padding-top: 104px;
    width: 1220px;
    margin: 0 auto;
  }

  .cart,.address{
    position: relative;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
  }
  .cart-title,.address-title{
    padding: 16px 32px;
    border-bottom: 1px solid #dddee1;
    border-radius: 10px 10px 0 0;
    background: #f8f8f9;
    font-size: 20px;
  }
  .cart-content-header{
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

  .address-item-list{
    padding: 30px 13px 0;
  }

  .pa{
    position: absolute;

  }
  .address-item-list li{
    position: relative;
    overflow: hidden;
    float: left;
    width: 276px;
    height: 158px;
    margin: 0 0 30px 16px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    background: #fafafa;
    line-height: 14px;
    text-align: left;
    word-wrap: break-word;
    word-break: normal;
    color: #626262;
    cursor: pointer;
    user-select: none;
  }
  .address-item-list li.checked {
    border-color: #6a8fe5;
    position: relative;
    background: #fff;
  }
  .address-item-list .add-address-item {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .address-item-list li.add-address-item p{
    margin-top: 5px;
  }
  .address-item-list .address {
    position: relative;
    padding: 19px 14px 0 19px;
  }
  .address-item-list .address li:hover {
    background: #f2f2f2;
  }
  .address-item-list li.checked .pa{
    right: 15px;
    top: 18px;
  }
  .address-item-list .address p {
    line-height: 26px;
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .address-item-list li .operation-section, .address-item-list li .operation-section span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .address-item-list li .operation-section{
    visibility: hidden;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 28px;
    background: #e1e1e1;
    transition: all .2s ease;
    -webkit-transform: translateY(29px);
    transform: translateY(29px);
    border-top: 1px solid #e1e1e1;
    z-index: 11;
  }
  .address-item-list li:hover .operation-section {
    visibility: visible;
    -webkit-transform: translate(0);
    transform: translate(0);
  }
  .address-item-list li .operation-section span {
    background: #fff;
    flex: 1;
    height: 100%;
  }
  .address-item-list li .operation-section span+span{
    border-left: 1px solid #e1e1e1;
  }
  .address-item-list li .operation-section span:hover {
    background: #f2f2f2;
  }


</style>
