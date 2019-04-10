<template>
  <Row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submitLogin">
    <Col :xs="{span:22}" class="login-col">
      <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>
      <Row class="login-form">
        <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
            <FormItem prop="username">
              <Input v-model="form.username" prefix="ios-contact" size="large" clearable placeholder="请输入用户名" autocomplete="off" />
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" prefix="ios-lock" size="large" clearable placeholder="请输入密码" autocomplete="off" />
            </FormItem>
            <Row :gutter="16">
              <Col span="12">
                <FormItem prop="decode">
                  <Input  v-model="form.decode" prefix="md-checkmark-circle-outline" size="large" clearable placeholder="请输入验证码" autocomplete="off" />
                </FormItem>
              </Col>
              <Col span="8">
                <a @click="showCaptImage" class="captimage">
                  <img v-bind:src="'data:image/jpeg;base64,'+imageBytes" class="img-class">
                </a>
              </Col>
            </Row>
        </Form>
        <Row>
          <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
                              <span v-if="!loading">登录</span>
                              <span v-else>登录中...</span>
                          </Button>
        </Row>
      </Row>
    </Col>
  </Row>
</template>

<script>
import Cookies from "js-cookie";
import {
    getCaptImage,
    login
} from "@/api/index";
import util from "@/libs/util.js";
import { Message } from 'iview';
export default {
  data() {
    return {
      error: false,
      errorMsg: "",
      tabName: "username",
      saveLogin: true,
      loading: false,
      sending: false,
      sended: false,
      imageBytes:"",
      count: 60,
      countButton: "60 s",
      maxLength: 6,
      errorCode: "",
      form: {
        username: "",
        password: "",
        key:"",
        decode: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        decode: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    showErrorMsg(msg) {
      this.error = true;
      this.errorMsg = msg;
    },
    submitLogin() {
        this.$refs.usernameLoginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            login({
                    username: this.form.username,
                    password: this.form.password,
                    key: this.form.key,
                    decode: this.form.decode
                  }).then(res => {
                    if (res.code === "000000") {
                      this.setStore("accessToken", res.data.token);
                      Cookies.set("userId",res.data.userId);
                      Cookies.set("groupId",res.data.groupId);
                      Cookies.set("username",res.data.userName,);
                      Cookies.set("position",JSON.stringify(res.data.position));
                      Cookies.set("lastLoginDate",JSON.stringify(res.data.lastLoginDate));
                      // 加载菜单
                      util.initRouter(this);
                      this.$router.push({
                          name: "home_index"
                      });
                    }else if(res.code ==="CE00000"){
                        this.showCaptImage();
                        this.loading = false;
                        Message.error("用户名或密码错误！");
                    }else if(res.code ==="CE00001"){
                        this.showCaptImage();
                        this.loading = false;
                        Message.error("远程验密异常，请联系管理员");
                    }else if(res.code ==="CE00002"){
                        this.showCaptImage();
                        this.loading = false;
                        Message.error("后端服务异常，请联系管理员");
                    }else if(res.code ==="CE00003"){
                        this.showCaptImage();
                        this.loading = false;
                        Message.error("获取用户信息异常，请联系管理员");
                    }else if(res.code ==="CE00005"){
                        this.showCaptImage();
                        this.loading = false;
                        Message.error("验证码错误，请点击验证码或重新输入");
                    }else {
                        this.showCaptImage();
                        this.loading = false;
                        Message.error("系统异常，请联系管理员！");

                    }
                  });
          } else {
              this.loading = false;
          }
        });
    },
    showCaptImage() {
        getCaptImage().then(res => {
            console.log(res);
            if(res.code = "000000"){
                this.form.key= res.data.key;
                this.imageBytes = res.data.img;
            }

        });
    }
  },
  mounted() {
    this.showCaptImage();
  }
};
</script>

<style lang="less">
@import "./login.less";
</style>
