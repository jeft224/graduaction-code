<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        订单查询
      </p>
      <Table  ref="selection" :data="ordersData" :columns="ordersColumns" ellipsis stripe border></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="page" @on-change="changePage" show-total></Page>
        </div>
      </div>
      <Modal  title="商品信息" v-model="ordersModal">
        <Form :model="orders" :label-width="80">
          <FormItem label="订单编号：">
            <Input v-model="orders.orderId" placeholder="订单编号" clearable style="width: 250px"></Input>
          </FormItem>
          <FormItem label="订单状态：">
            <Input v-model="orders.orderStatus" placeholder="订单状态" clearable style="width: 250px"></Input>
          </FormItem>
          <FormItem label="订单时间：">
            <Input  v-model="orders.orderTime" placeholder="订单时间" clearable style="width: 250px"></Input>
          </FormItem>
          <FormItem label="订单地址：">
            <Input v-model="address" placeholder="订单地址" clearable style="width: 250px"></Input>
          </FormItem>
          <FormItem label="商品列表：">
            <ul class="imglist" v-for="good in goodslist">
              <li><img class="goods-img" :src="good.productImg" alt=""><span class="goods-title">商品名称：{{good.productName}}</span></li>
              <li>数量：{{good.productNum}}</li>
              <li>价格：{{good.productPrice}}</li>
            </ul>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import api from '../api'
import { IsVersion } from '../utils/enviroment';
  export default {
    name: "order-list",
    data(){
      return{
        page:1,
        total:0,
        orders:{},
        ordersData:[],
        goodslist:[],
        address:'',
        ordersColumns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title:'订单编号',
            key:'orderId'
          },
          {
            title:'订单收件人名',
            // key:'addressInfo.receiverAddress'
            render:(h, params)=>{
              return h('div',this.ordersData[params.index].addressInfo.receiverName)
            }
          },
          {
            title:'订单地址',
            // key:'addressInfo.receiverAddress'
            render:(h, params)=>{
              return h('div',this.ordersData[params.index].addressInfo.receiverAddress)
            }
          },
          {
            title:'订单总金额',
            key:'orderTotal',
            render:(h, params)=>{
              return h('div',this.ordersData[params.index].orderTotal+" 元")
            }
          },
          {
            title:'订单时间',
            key:'orderTime',
          },
          {
            title:'订单状态',
            key:'orderStatus',
            width:90,
            render:(h, params)=>{
              return h('div',this.ordersData[params.index].orderStatus===1?"已支付":"未支付")
            }
          },
          {
            title:'操作',
            key:'action',
            width: 200,
            align: 'center',
            render: (h, params)=>{
              return h('div',[
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params,true)
                    }
                  }
                }, '订单详情'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                }, '删除订单')
              ])
            }
          }
        ],
        ordersModal:false
      }
    },
    mounted(){
      this.getAllOrder()
    },
    computed:{

    },
    methods:{
      getAllOrder(){
        api.getAllOrder(this.page).then((data)=>{
          console.log(data.data.result.orders)
          this.ordersData = data.data.result.orders
          this.total = data.data.result.total;

        })
      },
      changePage(row){
        this.page = row;
        this.getAllOrder()
      },
      show(index,status){
        console.log(index.row._id)
        api.getOrderById(index.row._id).then((data)=>{
          console.log(data)
          this.orders =data.data.result;
          this.address = data.data.result.addressInfo.receiverAddress;
          this.goodslist =data.data.result.goodsList;
        })
        this.goodslist.map((item) => {
          item.productImg = IsVersion(item.productImg)
        })
        this.ordersModal =status;
      },
      handleChange(date){
        // this.goods.createTime=date;
      },
      handleUpload(){

      },
      remove(params){
        console.log(params)
        api.deleteOrderById({_id:params.row._id}).then((res)=>{
          this.$Message.success(res.data.message)
        })
        this.getAllOrder()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .imglist{
    position: relative;
    display: flex;
    flex-direction: row;
  }
  ul>li{
    flex: 1;
    align-items: center;
    display: flex;
    margin-bottom: 5px;
  }
  ul>li:first-child{
    flex: 2;
  }
  .goods-img{
    width: 50px;
    height: 50px;
  }
  .goods-title{
    margin-left: 5px;
  }
</style>
