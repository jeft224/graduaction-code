<template>
  <div class="wrapper" @keydown.enter="handleSubmit">
    <div class="header">
      <router-link to="/">
        <img src="../assets/logo.png" alt="vue商城">
      </router-link>
      <span>商城</span>
    </div>
    <div class="content">
      <div class="content-form">
        <h2>注册账号</h2>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" class="form-box">
          <FormItem label="用户名：" prop="username">
            <Input type="text" v-model="formCustom.username" placeholder="Username"></Input>
          </FormItem>
          <FormItem label="设置密码:" prop="password">
            <Input type="password" v-model="formCustom.password" placeholder="Password"></Input>
          </FormItem>
          <FormItem label="确认密码:" prop="passwdCheck">
            <Input type="password" v-model="formCustom.passwdCheck" placeholder="Input password again"></Input>
          </FormItem>
          <Button type="primary" long class="btn-sub" @click="handleSubmit">注册</Button>
          <div class="tologin">
            <Icon type="android-send" ></Icon>
            <router-link to="/login"><span>已有登录账号，请登录！！！</span></router-link>
          </div>
        </Form>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import VFooter from '../components/VFooter'
  import api from '../api'
    export default {
        name: "register",
        data(){
          const validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              if (this.formCustom.passwdCheck !== '') {
                // 对第二个密码框单独验证
                this.$refs.formCustom.validateField('passwdCheck');
              }
              callback();
            }
          };
          const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再一次输入密码'));
            } else if (value !== this.formCustom.password) {
              callback(new Error('两个密码不匹配'));
            } else {
              callback();
            }
          };
          return{
            formCustom: {
              username: '',
              password: '',
              passwdCheck: ''
            },
            ruleCustom: {
              password: [
                { required:true,validator: validatePass, trigger: 'blur' }
              ],
              passwdCheck: [
                {required:true, validator: validatePassCheck, trigger: 'blur' }
              ],
              username: [
                { required:true, message:'用户名不能为空', trigger: 'blur' }
              ]
            }
          }
        },
        components:{
          VFooter
        },
        methods:{
          handleSubmit(){
            this.$refs.formCustom.validate((valid)=>{
              if(valid){
                this.$Loading.start();
                api.register(this.formCustom).then((data)=>{
                  if(data.data.code===1){
                    this.$Loading.finish();
                    this.$store.dispatch('UserStatus', false);
                    this.$store.dispatch('SetUserName',this.formCustom.username);
                    this.$Message.success(data.data.message);
                    this.$router.push({name:'login'})
                  }else{
                    this.$Message.error(data.data.message);
                  }
                })
              }else{
                this.$Message.error(data.data.message);
              }
            })
          }
        }
    }
</script>

<style scoped lang="scss">
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
    width: 100%;
    height: 580px;
    background: rgba(243, 241, 246, 0.38);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wrapper .content .content-form{
    background: #fff;
    width: 650px;
    height: 450px;
    box-shadow: 2px 1px 6px 1px rgba(158, 141, 141, 0.12);
  }
  .wrapper .content .content-form>h2{
    margin-top: 20px;
    color: #f56600;
    text-align: center;
    font-size: 1.5em;
  }

  .wrapper .content .content-form .form-box{
    margin: 50px auto;
    width: 400px;
  }
  .wrapper .content .content-form .form-box .btn-sub{
    margin-top: 10px;
    background-color: #f0732d;
    border-color: #f0732d;
    margin-left: 6px;
  }
  .wrapper .content .content-form .form-box .btn-sub:hover {
    background-color: darken( #2d8cf0,10%);
    border-color: darken( #2d8cf0,10%);
    transition: color cubic-bezier(0.4, 0.26, 0.43, 0.93) .3s;
  }
  .wrapper .content .content-form .form-box .tologin{
    margin: 15px 0 0 6px;
  }
  .wrapper .content-form .form-box .tologin>i{
    color:#f0732d;
    font-size:16px
  }
  .wrapper .content-form .form-box .tologin>a>span{
    color:#f0732d;
    font-size:16px
  }
  .wrapper .content-form .form-box .tologin:hover>i,.wrapper .content-form .form-box .tologin:hover>a>span{
    color:darken(#2d8cf0,10%);
  }
</style>
