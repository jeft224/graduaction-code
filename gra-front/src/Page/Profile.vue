<template>
  <div style="background: #ededed;">
    <v-header></v-header>
    <div class="page-user">
      <div class="user">
        <div class="user-title"><h2>个人资料</h2></div>
        <!--个人中心-->
        <div class="user-information">
          <Form ref="userForm" :model="userForm" :label-width="100" label-position="right" :rules="infoValidate">
            <FormItem label="用户头像：" prop="avatar">
              <div class="user-avatar" style="display:inline-block;width:80px;">
                <Avatar  class="avatar-img" shape="square" :src="userForm.avatar" style="width: 80px;height: 80px"/>
                <Upload ref="upload" class="uploadimg" :data="userForm" action="http://localhost:8000/api/userUpload" :show-upload-list="false"
                        :on-success="handleSuccess"  :format="['jpg','jpeg','png','ico']"
                        multiple  type="drag" style="">
                  <div style="width: 80px;height:80px;line-height: 80px;">
                    <Icon type="camera" size="20"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
            <FormItem label="用户昵称：" prop="username">
              <div style="display:inline-block;width:260px;">
                <Input v-model="userForm.username"></Input>
              </div>
            </FormItem>
            <FormItem label="性别：" prop="sex">
              <RadioGroup v-model="userForm.sex" type="button" size="large">
                <Radio label="男"></Radio>
                <Radio label="女"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="出生年月：" prop="birthday">
              <DatePicker type="date"  placeholder="Select date" @on-change="handleChange" v-model="userForm.birthday" style="width: 260px"></DatePicker>
            </FormItem>
            <FormItem label="手机号码：" prop="phone" >
              <div style="display:inline-block;width:260px;">
                <Input v-model="userForm.phone"  placeholder="手机号码"/>
              </div>
            </FormItem>
            <FormItem label="登录密码：">
              <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
            </FormItem>
            <div>
              <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
              <Button type="primary" style="width: 100px;" @click="saveEdit">保存</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
    <v-footer></v-footer>
    <Modal title="修改密码" v-model="pwdModal" @on-ok="EditPwd">
      <Form ref="Pwd" :model="Pwd" :rules="PwdRule" :label-width="100" class="form-box">
        <FormItem label="旧密码：" prop="oldPwd">
          <Input type="password" v-model="Pwd.oldPwd" placeholder="请输入旧密码" clearable style="width: 280px"></Input>
        </FormItem>
        <FormItem label="新密码：" prop="newPwd">
          <Input type="password" v-model="Pwd.newPwd" placeholder="请输入新密码" clearable style="width: 280px"></Input>
        </FormItem>
        <FormItem label="确认密码：" prop="PwdCheck">
          <Input type="password" v-model="Pwd.PwdCheck" placeholder="请再一次输入新密码" clearable style="width: 280px"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import VHeader from '../components/VHeader'
  import VFooter from '../components/VFooter'
  import {mapState,mapMutations} from 'vuex'
  import api from '../api'
    export default {
        name: "profile",
        data(){
          const validatePwd = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              if (this.Pwd.PwdCheck !== '') {
                // 对第二个密码框单独验证
                this.$refs.Pwd.validateField('PwdCheck');
              }
              callback();
            }
          };
          const validatePwdCheck = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再一次输入密码'));
            } else if (value !== this.Pwd.newPwd) {
              callback(new Error('两个密码不匹配'));
            } else {
              callback();
            }
          };
          return {
            Pwd:{
              userId:"",
              oldPwd:"",
              newPwd:"",
              PwdCheck:"",
            },
            userForm:{},
            infoValidate:{
              username: [
                { required: true, message: '请输入用户昵称', trigger: 'blur' }
              ],
              sex:[
                { required: true, message: '请选择', trigger: 'blur' }
              ]
            },
            pwdModal:false,
            PwdRule:{
              oldPwd: [
                { required:true,message: "请输入原密码！", trigger: 'blur' }
              ],
              newPwd: [
                { required:true,validator: validatePwd, trigger: 'blur' }
              ],
              PwdCheck: [
                {required:true, validator: validatePwdCheck, trigger: 'blur' }
              ],
            }
          }
        },
        methods:{
          saveEdit(){
            this.$Loading.start();
            this.$refs.userForm.validate((valid)=>{
              if(valid){
                api.userUpdate(this.userForm).then((data)=>{
                  this.$Loading.finish();
                  this.$Message.success(data.data.message);
                })
              }
            })
          },
          EditPwd(){
            this.$refs.Pwd.validate((valid)=>{
              if(valid){
                api.pwdUpdate(this.Pwd).then((res)=>{
                  this.$Loading.finish();
                  if(res.data.code===1){
                    this.$Message.success(res.data.message);
                  }else{
                    this.$Message.error(res.data.message);
                  }
                })
              }
            })
          },
          cancelEditUserInfor(){

          },
          handleChange(date){
            this.userForm.birthday=date;
          },
          handleSuccess(res, file){
            console.log(file)
            if(file.response.result.filespath.includes('http')||file.response.result.filespath.includes('https')){
              this.userForm.avatar = file.response.result.filespath;
            }else{
              this.userForm.avatar =`http://localhost:8000/${file.response.result.filespath}`;
            }
            this.$store.dispatch('SetUserAvatar',this.userForm.avatar);
          },
          showEditPassword(){
              this.pwdModal=true;
          },
          handleBeforeUpload(){

          },
          handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
          },
        },
        components:{
        VHeader,
        VFooter
        },
        computed:{
          ...mapState(['token'])
        },
        created(){
          if(!this.token){
            this.$router.push({path:'/login'})
          }
          api.queryUserById().then((res)=>{
            console.log(res.data.result)
            this.userForm = res.data.result;
            this.Pwd.userId = res.data.result._id;
            if(res.data.result.avatar.includes('http')||res.data.result.avatar.includes('https')){
              this.userForm.avatar = res.data.result.avatar;
            }else{
              this.userForm.avatar =`http://localhost:8000/${res.data.result.avatar}`;
            }
            this.$store.dispatch('SetUserAvatar',this.userForm.avatar);
          })
        }
    }
</script>

<style scoped>
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
    line-height: 0;
    visibility: hidden;
  }
  .page-user{
    padding-top: 104px;
    width: 1000px;
    margin: 0 auto;
    padding-bottom: 20px;
    min-height: 600px;
  }
  .user{
    position: relative;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
  }
  .user-title{
    padding: 16px 32px;
    border-bottom: 1px solid #dddee1;
    border-radius: 10px 10px 0 0;
    background: #f8f8f9;
    font-size: 20px;
  }
  .user-information{
    margin: 20px 0px;
  }
  .page-user .user .user-avatar{
    position: relative;
  }
  .page-user .user  .uploadimg{
    width:80px;
    display: none;
    position: absolute;
    top: 0;
  }

  .page-user .user  .user-avatar:hover .uploadimg {
    display: block;
    cursor: pointer;
  }
</style>
