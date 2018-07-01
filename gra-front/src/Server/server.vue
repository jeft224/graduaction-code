<template>
    <div>
      <Card>
         <div class="home-main">
           <Row :gutter="10" >
             <Col :md="24" :lg="8" >
                <Row :gutter="10" class-name="home-page-row1">
                  <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                    <Card>
                      <Row type="flex" class="user-infor">
                        <Col span="8">
                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                          <img class="avator-img" :src="adminAvatar" />
                        </Row>
                        </Col>
                        <Col span="16" style="padding-left:6px;">
                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                          <div>
                            <b class="card-user-infor-name">Admin</b>
                            <p>super admin</p>
                          </div>
                        </Row>
                        </Col>
                      </Row>
                      <div class="line-gray"></div>
                      <Row class="margin-top-8">
                        <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                        <Col span="16" class="padding-left-8">2018.05.24-13:32:20</Col>
                      </Row>
                      <Row class="margin-top-8">
                        <Col span="8"><p class="notwrap">上次登录地点:</p></Col>
                        <Col span="16" class="padding-left-8">南昌</Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                    <Card>
                    <p slot="title" class="card-title">
                      <Icon type="android-checkbox-outline"></Icon>
                      待办事项
                    </p>
                    <a type="text" slot="extra" @click.prevent="addNewToDoItem">
                      <Icon type="plus-round"></Icon>
                    </a>
                    <Modal
                      v-model="showAddNewTodo"
                      title="添加新的待办事项"
                      @on-ok="addNew"
                      @on-cancel="cancelAdd">
                      <Row type="flex" justify="center">
                        <Input v-model="newToDoItemValue" icon="compose" placeholder="请输入..." style="width: 300px" />
                      </Row>
                      <Row slot="footer">
                        <Button type="text" @click="cancelAdd">取消</Button>
                        <Button type="primary" @click="addNew">确定</Button>
                      </Row>
                    </Modal>
                    <div class="to-do-list-con">
                      <div v-for="(item, index) in toDoList" :key="'todo-item' + (toDoList.length - index)" class="to-do-item">
                        <to-do-list-item :content="item.title"></to-do-list-item>
                      </div>
                    </div>
                  </Card>
                  </Col>
                </Row>
             </Col>
             <Col :md="24" :lg="16">
                <Row :gutter="5">
               <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
               <infor-card
                 id-name="user_created_count"
                 :end-val="count.createUser"
                 iconType="android-person-add"
                 color="#2d8cf0"
                 intro-text="今日新增用户"
               ></infor-card>
               </Col>
               <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
               <infor-card
                 id-name="visit_count"
                 :end-val="count.visit"
                 iconType="ios-eye"
                 color="#64d572"
                 :iconSize="50"
                 intro-text="今日浏览量"
               ></infor-card>
               </Col>
               <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
               <infor-card
                 id-name="collection_count"
                 :end-val="count.collection"
                 iconType="upload"
                 color="#ffd572"
                 intro-text="今日数据采集量"
               ></infor-card>
               </Col>
               <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
               <infor-card
                 id-name="transfer_count"
                 :end-val="count.transfer"
                 iconType="shuffle"
                 color="#f25e43"
                 intro-text="今日服务调用量"
               ></infor-card>
               </Col>
             </Row>
             </Col>
           </Row>
         </div>
      </Card>
    </div>
</template>

<script>
  import toDoListItem from '../components/toDoListItem'
  import inforCard from '../components/inforCard'
  import {mapState} from 'vuex'
    export default {
        name: "server",
        data(){
          return {
            toDoList: [
              {
                title: '添加商品'
              },
              {
                title: '删除用户'
              },
              {
                title: '禁用用户'
              },
              {
                title: '删除订单'
              },
              {
                title: '修改用户信息'
              }
            ],
            count: {
              createUser: 496,
              visit: 32,
              collection: 243,
              transfer: 39
            },
            showAddNewTodo: false,
            newToDoItemValue: ''
          }
        },
        computed:{
            ...mapState({adminAvatar:'adminAvatar'})
        },
        methods:{
          addNewToDoItem(){
              this.showAddNewTodo = true
          },
          cancelAdd(){
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
          },
          addNew(){
            if (this.newToDoItemValue.length !== 0) {
              this.toDoList.unshift({
                title: this.newToDoItemValue
              });
              setTimeout(() => {
                this.newToDoItemValue = '';
              }, 200);
              this.showAddNewTodo = false;
            } else {
              this.$Message.error('请输入待办事项内容');
            }
          }

        },
        components:{
          toDoListItem,
          inforCard
        }
    }
</script>

<style scoped>
  .user-infor{
    height: 135px;
  }
  .avator-img{
    display: block;
    width: 80%;
    max-width: 100px;
    height: auto;
  }
  .card-user-infor-name{
    font-size: 2em;
    color: #2d8cf0;
  }
  .line-gray{
    border-bottom: 1px solid gray;
    margin-bottom: 2px;
  }
  .card-title{
    color: #abafbd;
  }
  .made-child-con-middle{
    height: 100%;
  }
  .to-do-list-con{
    height: 145px;
    overflow: auto;
  }
  .to-do-item{
    padding: 2px;
  }
  .infor-card-con{
    height: 100px;
  }
  .infor-card-icon-con{
    height: 100%;
    color: white;
    border-radius: 3px 0 0 3px;
  }
  .map-con{
    height: 305px;
  }
  .map-incon{
    height: 100%;
  }
  .data-source-row{
    height: 200px;
  }
  .line-chart-con{
    height: 150px;
  }
</style>
