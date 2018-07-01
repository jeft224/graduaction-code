<template>
  <Col :md="24" :lg="8">
    <Row class-name="home-page-row1" :gutter="10">
      <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
        <Card>
        <Row type="flex" class="user-infor">
          <Col span="8">
          <Row class-name="made-child-con-middle" type="flex" align="middle">
            <img class="avator-img" :src="avatorPath"/>
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
          <Col span="8">
          <p class="notwrap">上次登录时间:</p></Col>
          <Col span="16" class="padding-left-8">
          2017.09.12-13:32:20</Col>
        </Row>
        <Row class="margin-top-8">
          <Col span="8">
          <p class="notwrap">上次登录地点:</p></Col>
          <Col span="16" class="padding-left-8">
          北京</Col>
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
            <Input v-model="newToDoItemValue" icon="compose" placeholder="请输入..." style="width: 300px"/>
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
</template>
<script>
  export default {
    props: {
      msg: {type: [Object, Array]}
    },
  }
</script>
<style lang="scss" scoped>
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
    /*.ds {*/
    /*!*display: flex;*!*/
    /*!*align-items: center;*!*/
    /*!*justify-content: center;*!*/
    /*width: 100%;*/
    /*display: none;*/
    /*}*/
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
</style>
