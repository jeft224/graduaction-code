<template>
  <Row class="to-do-list-item">
    <Col span="2" class="height-100">
    <Row type="flex" justify="center" align="middle" class="height-100">
      <Checkbox v-model="todoitem"></Checkbox>
    </Row>
    </Col>
    <Col span="22" class="height-100">
    <Row type="flex" justify="start" align="middle" class="height-100">
      <p class="to-do-list-item-text" @click="handleHasDid" :class="{hasDid: todoitem}">{{ content }}</p>
    </Row>
    </Col>
  </Row>
</template>

<script>
  export default {
    name: 'toDoListItem',
    data () {
      return {
        todoitem: false
      };
    },
    props: {
      content: String
    },
    methods: {
      handleHasDid () {
        this.todoitem = !this.todoitem;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .to-do-list-item-text{
    word-break:keep-all;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    cursor: pointer;
    height: 36px;

    .height-100{
      height: 100%;
    }
    .infor-icon-row{
      color: #c8c8c8;
    }
  }
  .hasDid{
    text-decoration: line-through;
    color: gray;
    font-weight: 100;
  }
</style>
