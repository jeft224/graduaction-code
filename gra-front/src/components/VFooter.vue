<template>
  <div class="footer">
    <div class="tag">
      <ul class="tag-list">
        <li><a href="javascript:;">简体</a></li>
        <li><a href="javascript:;">繁体</a></li>
        <li><a href="javascript:;">English</a></li>
        <li><a href="javascript:;">常见问题</a></li>
      </ul>
    </div>
    <div class="cop">
          <p class="cop-intro">Copyright © 2017-2018  xx.com 版权所有</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "vfooter"
    }
</script>

<style scoped>
  .footer {
    padding: 55px 0 10px;
    background: #fff;
    margin-top: 20px;
    /*position: relative;*/
  }
  .tag {
    display: flex;
    justify-content: center;
    /*position: relative;*/
  }
  .tag .tag-list {
    display: flex;
    flex-direction: row;
  }
  .tag .tag-list>li {
    height: 14px;
    padding: 0 10px;
    line-height: 14px;
  }
  .tag .tag-list>li + li {
    border-left: 1px solid #666;
  }
  .cop {
    text-align: center;
    margin: 10px 0;
  }
</style>
