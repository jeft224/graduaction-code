<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        用户查询
      </p>
      <Table  ref="selection" :data="userList" :columns="userColumns" ellipsis stripe border></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="page" @on-change="changePage" show-total></Page>
        </div>
      </div>
      <Modal  title="用户信息" v-model="goodsModal">
        <Form :model="user" :label-width="80">
          <FormItem label="昵称：">
            <Input v-model="user.username" placeholder="姓名" clearable style="width: 250px"></Input>
          </FormItem>
          <FormItem label="出生年月：">
            <DatePicker type="date"  placeholder="Select date" @on-change="handleChange" v-model="user.birthday" style="width: 250px"></DatePicker>
          </FormItem>
          <FormItem label="手机号码：">
            <Input number  v-model="user.phone" placeholder="手机号码" clearable style="width: 250px"></Input>
          </FormItem>
          <FormItem label="性别：">
            <RadioGroup v-model="user.sex" type="button" size="large">
              <Radio label="男"></Radio>
              <Radio label="女"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="添加时间：">
            <DatePicker type="date"  placeholder="Select date" @on-change="handleChange" v-model="user.createTime" style="width: 250px"></DatePicker>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import api from '../api'
  export default {
    name: "users-list",
    data(){
      return{
        page:1,
        total:0,
        user:{},
        tagList:[],
        uploadList:[],
        userList:[],
        userColumns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title:'姓名',
            key:'username',
          },
          {
            title:'出生日期',
            key:'birthday',
            sortable: true
          },
          {
            title:'性别',
            key:'sex'
          },
          {
            title:'电话',
            key:'phone'
          },
          {
            title:'创建时间',
            key:'createTime',
            sortable: true
          },
          {
            title:'用户状态',
            key:'status',
            render: (h, params) => {
              return h('div', this.userList[params.index].status?"启用":"禁用")
            }
          },
          {
            title:'操作',
            key:'action',
            width: 280,
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
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delete(params)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params,true)
                    }
                  }
                }, '启用'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params,false)
                    }
                  }
                }, '禁用'),
              ])
            }
          }
        ],
        goodsModal:false
      }
    },
    mounted(){
      this.getUsers()
    },
    computed:{
    },
    methods:{
      getUsers(){
        api.getUsers(this.page).then((data)=>{
          this.userList = data.data.result.users
          this.total = data.data.result.total;
        })
      },
      changePage(row){
        this.page = row;
        this.getUsers()
      },
      show(index,status){
        console.log(index.row)
        this.goodsModal =status;
        api.getUserById(index.row._id).then((data)=>{
          console.log(data)
          this.user = data.data.result.user
        })

      },
      delete(index){
        api.deleteUserById({_id:index.row._id}).then((res)=>{
          if(res.data.code===1){
            this.$Message.success(res.data.message)
          }
        })
        this.getUsers()
      },
      handleChange(date){
        // this.goods.createTime=date;
      },
      handleUpload(){

      },
      remove(index,status){
        //启用
        if(status){
          api.userEdit({_id:index.row._id,status:status}).then((res)=>{
            this.$Message.success(res.data.message);
            this.userList[index].status =true
          })
        }else{
          //禁用
          api.userEdit({_id:index.row._id,status:status}).then((res)=>{
            this.$Message.success(res.data.message);
          })
        }
        this.getUsers()
      },
    }
  }
</script>

<style scoped>

</style>
