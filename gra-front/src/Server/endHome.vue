<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <div class="layout-logo-left" v-if="!isCollapsed">
          <Icon type="paper-airplane"></Icon>
          <span class="layout-text"> Admin 管理系统</span>
        </div>
        <div class="layout-logo-left" v-else>
          <Icon type="paper-airplane"></Icon>
        </div>
        <Menu :active-name="this.$route.path"  theme="dark" width="auto" :class="menuitemClasses" @on-select="menuSelect" >
          <template v-for="(item,index) in routes">
            <Submenu :name=item.name v-if="!item.leaf">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                <span class="layout-text" >{{item.name}}</span>
              </template>
              <template v-for="(child,childIndex) in item.children" v-if="!child.hidden">
                <Menu-item :name="child.path">{{child.name}}</Menu-item>
              </template>
            </Submenu>
            <template  v-if="item.leaf&&item.hidden">
              <Menu-item :name="item.path" :data-link="item.path">
                <Icon :type="item.iconCls"></Icon>
                <span class="layout-text" >{{item.name}}</span>
              </Menu-item>
            </template>
          </template>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0,boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}" class="layout-header-bar">
          <Icon :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24" @click.native="collapsedSider"></Icon>
          <div class="userinfo">
            <Dropdown placement="bottom-end">
              <span class="head-img">
                {{adminUsername}}
                <Avatar :src="adminAvatar"/>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item @click.native="loginuserinfo()">个人中心</Dropdown-item>
                <Dropdown-item  @click.native="logout()" divided>退出</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </div>
        </Header>
        <Content :style="{margin: '10px'}">
          <Breadcrumb :style="{margin: '10px 0'}">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <Breadcrumb-item>{{$route.name==="tohome"?"":$route.name}}</Breadcrumb-item>
          </Breadcrumb>
          <div style="height: 650px">
            <router-view></router-view>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import {exportAdmin} from '../utils/jwt'
  import {mapState} from 'vuex'
  import api from '../api'
  export default {
    data () {
      return {
        isCollapsed: false,
        routes:[],
      }
    },
    computed: {
      rotateIcon () {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      },
      menuitemClasses () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
      ...mapState({adminUsername:'adminUsername',adminAvatar:'adminAvatar'})
    },
    methods: {
      collapsedSider () {
        this.$refs.side1.toggleCollapse();
      },
      menuSelect(name) {
        this.$router.push({ path: name });
      },
      loginuserinfo(){
        this.$router.push({path:'/ownspace'})
      },
      logout(){
        this.$store.dispatch('AdminLogOut');
        this.$router.push({path:'/admin/login'})
      }
    },
    mounted(){
      this.$store.dispatch('SetAdminUserName',exportAdmin().username);
      const array = this.$router.options.routes;
      this.routes = array.filter((item)=>{
        return item.path.match('admin')
      })
      console.log(this.$route.path)

      const id = exportAdmin().userId;
      api.adminquery(id).then((res) =>{
        this.userForm = res.data.result;
        if(res.data.result.avatar.includes('http')||res.data.result.avatar.includes('https')){
          this.$store.dispatch('SetAdminAvatar',res.data.result.avatar);
        }else{
          this.$store.dispatch('SetAdminAvatar',`http://localhost:8000/${res.data.result.avatar}`);
        }
      })
    }
  }
</script>
<style scoped lang="scss">
.layout-logo-left{
  margin-top: 10px;
  height: 30px;
  color: #fff;
  font-size: 20px;
  text-align: center;
}
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.layout-logo-left{
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon{
  transition: all .3s;
}
.rotate-icon{
  transform: rotate(-90deg);
}
.menu-item span{
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}
.menu-item i{
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span{
  width: 0px;
  transition: width .2s ease;
}
.collapsed-menu i{
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}
.userinfo{
  display: inline;
  float: right;
  margin-right: 20px;
  .head-img{
    font-size: 16px;
    color: darken(#3bbfce,9%);
  }
  cursor: pointer;
}
</style>
