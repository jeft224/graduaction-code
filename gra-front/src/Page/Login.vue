<template>
    <div class="wrapper" @keydown.enter="handleSubmit('userForm')">
      <div class="header">
        <router-link to="/">
          <img src="../assets/logo.png" alt="">
        </router-link>
        <span>商城</span>
      </div>
      <div class="content">
          <div class="form">
            <h2>账号登录</h2>
            <Form ref="userForm" :model="user" :rules="ruleInline">
              <FormItem prop="username">
                <Input type="text" v-model="user.username" size="large" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="user.password" size="large" placeholder="Password">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSubmit('userForm')" size="large" long >Signin</Button>
              </FormItem>
              <FormItem>
                <Icon type="android-send" style="color:blue;font-size:14px"></Icon>
                <router-link to="/register"><span>立即注册</span></router-link>
              </FormItem>
            </Form>
          </div>
      </div>
      <v-footer></v-footer>
    </div>

</template>

<script>
  import api from '../api'
  import VFooter from '../components/VFooter'
    export default {
        name: "login",
        data(){
          return{
            user: {
              username: '',
              password: ''
            },
            ruleInline: {
              username: [
                { required: true, message: '账号不能为空', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { type: 'string', min: 6, message: '密码位数不少于6位', trigger: 'blur' }
              ]
            }
          }
        },
        methods:{
          handleSubmit(name) {
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.$Loading.start();
                api.login(this.user).then((data)=>{
                    console.log(data.data);
                    if(data.data.code===1){
                      this.$store.dispatch('UserLogin', data.data.result);
                      this.$store.dispatch('UserStatus', false);
                      this.$Message.success(data.data.message);
                      this.$router.push({path:'/'});
                    }else{
                      this.$Message.error(data.data.message);
                    }
                    this.$Loading.finish();
                })
              } else {
                this.$Message.error('登录失败!');
              }
            })
          }
        },
        components:{
          VFooter
        }
    }
</script>

<style scoped>
  .wrapper{
    padding-top: 10px;
  }
  .wrapper .header{
    width: 1130px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
  .wrapper .header>a>img {
    width: 60px;
    height: 60px;
  }
  .wrapper .header>span{
    padding-left: 5px;
    line-height: 20px;
    font-size: 30px;
  }
  .wrapper .content{
    background-image: url(../assets/login.png) ;
    background-size: cover;
    width: 100%;
    height: 599px;
    position: relative;

    background-repeat: no-repeat;
    background-position:center center;
  }
  .wrapper .content>.form{
    background: #fff;
    width: 425px;
    height: 350px;
    position: absolute;
    right: 60px;
    top: 98px;
    border-radius: 2px;
    box-shadow: 3px 3px 5px #aaaaaa;
    zoom:1;
  }
  .wrapper .content>.form>h2{
    text-align: center;
    padding: 15px 0;
    color: #f56600;
    font-size: 1.5em;
  }
  .wrapper .content>.form>Form{
    margin: 10px 50px 0 50px;
  }
  .wrapper .content>.form>Form>FormItem{
    margin: 5px 0;
  }
  .wrapper .content>.form>Form>FormItem>span{
    height: 40px;
  }
</style>
