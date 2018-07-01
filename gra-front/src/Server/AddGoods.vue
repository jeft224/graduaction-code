<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        商品添加
      </p>
      <div>
        <Form :model="goods" :label-width="80">
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
            <Upload multiple action="" ref="upload" :show-upload-list="false" :before-upload="handleUpload" v-model="goods.productImageSmall">
              <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
            <div class="demo-upload-list" v-for="item in uploadList" >
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </div>
          </FormItem>
          <FormItem label="添加时间：">
            <DatePicker type="date"  placeholder="日期选择" @on-change="handleChange" v-model="goods.createTime" style="width: 250px"></DatePicker>
          </FormItem>
          <FormItem label="商品类别：">
            <Select v-model="goods.tag" style="width:250px">
              <Option v-for="item in tagList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品热度：" prop="hot">
            <Radio v-model="goods.hot" size="large">
              <Icon type="social-apple"></Icon>
              <span>热门</span>
            </Radio>
          </FormItem>
          <FormItem label="商品信息：">
            <Input v-model="goods.sub_title" type="textarea" style="width:400px" :rows="5" :autosize="{minRows: 6,maxRows: 8}" placeholder="输入商品详情..."></Input>
          </FormItem>
          <FormItem>
            <Button value="primary" @click="GoodsSubmit()">Submit</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>

</template>

<script>
    import api from '../api'
    export default {
        name: "add-goods",
        data(){
          return {

            uploadList:[],
            goods:{
              productName:'',
              stock:'',
              salePrice:null,
              productImageSmall:[],
              createTime:'',
              sub_title:'',
              file:[],
              hot:false,
            },
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
            ]
          }
        },
        methods:{
          GoodsSubmit(){
              api.upload(this.goods).then((data)=>{
                  this.$Message.success(data.data.message)
                  console.log(data)
              })
          },
          handleRemove (file) {
            this.uploadList.splice(this.uploadList.indexOf(file), 1);
          },
          handleChange(date){
            this.goods.createTime=date;
          },
          handleUpload(file){
            this.goods.file.push(file);
            console.log(file)
            let reader = new FileReader()
            // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
            // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
            // 读取文件作为 URL 可访问地址
            reader.readAsDataURL(file)
            const _this = this
            reader.onloadend = function (e) {
              file.url = reader.result
              _this.uploadList.push(file)
            }
            console.log(this.uploadList);
            return false
          }
        }
    }
</script>

<style scoped>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid #d1080800;
    border-radius: 4px;
    overflow: hidden;
    background: #d9d6d6;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
    margin-top: 6px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
