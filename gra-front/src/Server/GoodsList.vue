<template>
    <div>
      <Card>
        <p slot="title">
          <Icon type="person"></Icon>
          商品查询
        </p>
        <Table  ref="selection" :data="goodsData" :columns="goodsColumns" ellipsis stripe border></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" :current="page" @on-change="changePage" show-total></Page>
          </div>
        </div>
        <Modal  title="商品信息" v-model="goodsModal" @on-ok="saveEdit">
          <Form ref="goods" :model="goods" :label-width="80">
            <FormItem label="商品编号：">
              <Input v-model="goods.productId" disabled placeholder="商品名称"  style="width: 250px"></Input>
            </FormItem>
            <FormItem label="商品名称：">
              <Input v-model="goods.productName" placeholder="商品名称" clearable style="width: 250px"></Input>
            </FormItem>
            <FormItem label="商品单价：">
              <Input number  v-model="goods.salePrice" placeholder="商品单价" clearable style="width: 250px"></Input>
            </FormItem>
            <FormItem label="商品数量：">
              <Input number  v-model="goods.stock" placeholder="商品数量" clearable style="width: 250px"></Input>
            </FormItem>
            <FormItem label="商品图片：">
              <div  v-for="item in goods.productImageSmall" style="display:inline;margin-left:5px" v-if="goods.productImageSmall.length">
                <img :src="item" alt="" width="50px" height="50px">
              </div>
              <Upload multiple action="" ref="upload"  :on-success="handleSuccess" :before-upload="handleUpload" v-model="goods.productImageSmall">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
              </Upload>
            </FormItem>
            <FormItem label="添加时间：">
              <DatePicker type="date" v-model="goods.createTime" format="yyyy-MM-dd" placeholder="Select date" @on-change="handleChange"  style="width: 250px"></DatePicker>
            </FormItem>
            <FormItem label="商品热度：">
              <Radio v-model="goods.hot" size="large">
                <Icon type="social-apple"></Icon>
                <span>热门</span>
              </Radio>
            </FormItem>
            <FormItem label="商品类别：">
              <Select v-model="goods.tag" style="width:250px">
                <Option v-for="item in tagList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="商品信息：">
              <Input v-model="goods.sub_title" type="textarea" style="width:400px" :rows="5" :autosize="{minRows: 6,maxRows: 8}" placeholder="Enter something..."></Input>
            </FormItem>
          </Form>
        </Modal>
      </Card>
    </div>
</template>

<script>
    import api from '../api'
    import {IsVersion} from '../utils/enviroment.js'
    export default {
        name: "goods-list",
        data(){
          return{
            page:1,
            total:0,
            goods:{},
            tagList:[
              {value: 'phones', label: '手机 电话卡'},
              {value: 'computer', label: '笔记本 平板'},
              {value: 'box', label: '电视 盒子'},
              {value: 'router', label: '路由器 智能硬件'},
              {value: 'power', label: '移动电源 电池 插线板'},
              {value: 'headset', label: '耳机 音响'},
              {value: 'foil', label: '保护套 贴膜'},
              {value: 'line', label: '线材 支架 存储卡'},
              {value: 'bags', label: '箱包 服饰'},
              {value: 'rabbit', label: '兔米 生活周边'}
            ],
            uploadList:[],
            goodsData:[],
            goodsColumns:[
              {
                type: 'selection',
                width: 59,
                align: 'center'
              },
              {
                title:'商品编号',
                key:'productId'
              },
              {
                title:'商品名称',
                key:'productName'
              },
              {
                title:'商品图片',
                key:'productImageSmall',
                render: (h, params) => {
                  return h('img',{
                    attrs:{
                      src:IsVersion(this.goodsData[params.index].productImageSmall[0])
                    },style:{
                      width:'30px',
                      height:'30px'
                    }})
                }
              },
              {
                title:'商品单价',
                key:'salePrice',
                sortable: true
              },
              {
                title:'商品数量',
                key:'stock',
                sortable: true
              },
              {
                title:'商品类别',
                key:'tag',
                render: (h, params) => {
                  return h('div',this.tagList.map(tag =>{return tag.value ===this.goodsData[params.index].tag?tag.label:""}))
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
                    }, '编辑'),
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
                    }, '查看'),
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
                    }, '删除')
                  ])
                }
              }
            ],
            goodsModal:false
          }
        },
        mounted(){
          this.getGoods()
        },
        computed:{

        },
        methods:{
          saveEdit(){
            this.$Loading.start();
            api.goodUpdate(this.goods).then((data)=>{
              this.$Loading.finish();
              this.$Message.success(data.data.message);
            })
            this.getGoods()
          },
          getGoods(){
            api.getGoods(this.page).then((data)=>{
              console.log(data.data.result.goods)
              this.goodsData = data.data.result.goods
              this.total = data.data.result.total;
            })
          },
          changePage(row){
            console.log("aaaa"+row)
            this.page = row;
            this.getGoods()
          },
          show(index,status){
            console.log(index.row.productId)
            api.getGoodsById(index.row.productId).then((data)=>{
                console.log(data)
              this.goods = data.data.result.good;
              this.goods.productImageSmall = IsVersion(this.goods.productImageSmall);
            })
            this.uploadList = IsVersion(this.goods.productImageSmall);
            console.log(this.uploadList)
            this.goodsModal =status;

          },
          handleChange(date){
            this.goods.createTime=date;
          },
          handleUpload(){

          },
          handleSuccess(res, file){
            console.log(file)
            //this.userForm.avatar=`http://localhost:8000/${file.response.result.filespath}`;
          },
          remove(params){
            api.goodDelete({productId:params.row.productId}).then((res)=>{
              this.$Message.success(res.data.message)
            })
            this.getGoods()
          }

        }
    }
</script>

<style scoped>

</style>
