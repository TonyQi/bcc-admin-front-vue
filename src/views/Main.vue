<style lang="less">
@import "./main.less";
</style>

<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con menu-bar" :style="{width: shrink?'60px':'220px', overflow: shrink ? 'visible' : 'auto'}">
      <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
        <div slot="top" class="logo-con">
          <img v-show="!shrink" src="../assets/logo.png" key="max-logo" />
          <img v-show="shrink" src="../assets/logo_min.png" key="min-logo" />
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'220px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                          <Icon type="md-menu" size="32"></Icon>
                      </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">

          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ username }}</span>
                  <Icon type="md-arrow-dropdown" />
                  <Avatar style="margin-left: 10px;" class="avatar-head"></Avatar>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="changePass">{{ $t('changePass') }}</DropdownItem>
                  <DropdownItem name="loginout" divided>{{ $t('logout') }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'220px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
    <Modal
            v-model="showChangePasswd"
            title="修改密码"
            @on-ok="saveChangePwd"
            @on-cancel="cancelChangePwd">
      <Form ref="formInline" :model="formInline" :rules="passwordValidate" :label-width="100">
        <FormItem label="当前用户" prop="tlrno">
          <Input type="text" v-model="formInline.tlrno" placeholder="当前用户" :disabled="true">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem label="旧密码" prop="passwd">
          <Input type="password" v-model="formInline.passwd" placeholder="旧密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem label="请输入新密码" prop="resefieldoen">
          <Input type="password" v-model="formInline.resefieldoen" placeholder="新密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem label="重复新密码" prop="resefieldoen1">
          <Input type="password" v-model="formInline.resefieldoen1" placeholder="重复输入密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./main-components/tags-page-opened.vue";
import breadcrumbNav from "./main-components/breadcrumb-nav.vue";
import fullScreen from "./main-components/fullscreen.vue";
import lockScreen from "./main-components/lockscreen/lockscreen.vue";
import messageTip from "./main-components/message-tip.vue";
import Cookies from "js-cookie";
import util from "@/libs/util.js";
import { changePassPwd
} from '@/api/index';

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip
  },
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.formInline.resefieldoen) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      shrink: false,
      username: "",
      userId: "",
      isFullScreen: false,
      showChangePasswd: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
      formInline:{
        tlrno:''
      },
      passwordValidate: {
        passwd: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          },
          {
            min: 6,
            message: "请至少输入6个字符",
            trigger: "blur"
          }
        ],
        resefieldoen: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          },
          {
            min: 6,
            message: "请至少输入6个字符",
            trigger: "blur"
          },
          {
            max: 32,
            message: "最多输入32个字符",
            trigger: "blur"
          }
        ],
        resefieldoen1: [
          {
            required: true,
            message: "请再次输入新密码",
            trigger: "blur"
          },
          {
            validator: valideRePassword,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatarPath() {
      return localStorage.avatorImgPath;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    }
  },
  stompClient: {
    monitorIntervalTime: 100,
    stompReconnect: true,
    timeout(orgCmd) {}
  },
  methods: {
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name);
      // this.$store.commit("updateMenulist");
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.username = Cookies.get("username");
      this.userId = Cookies.get("userId");
      this.checkTag(this.$route.name);
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleLanDropdown(name) {
      localStorage.lang = name;
      this.$store.commit("switchLang", name);
    },
    handleClickUserDropdown(name) {
      if (name === "changePass") {
        util.openNewPage(this, "change_pass");
        this.showChangePasswd = true;
        this.formInline.tlrno = Cookies.get("username");
      } else if (name === "loginout") {
        // 退出登录
        this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        // 强制刷新页面 重新加载router
        location.reload();
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // console.log(name)
      return true;
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    saveChangePwd(){
      this.formInline.tlrno = Cookies.get("userId");
      changePassPwd(this.formInline).then(res =>{
        let code = res.code;
        if (code ==="000000"){
          this.$Notice.success({
            title: '密码修改成功',
            desc:  ''
          });
          this.showChangePasswd = false;
        }else{
          this.$Notice.error({
            title: '原密码错误',
            desc:  ''
          });
        }


      });
    },
    cancelChangePwd(){
      this.showChangePasswd = false;
    }
  },
  watch: {
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    }
  },
  mounted() {
    this.init();
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
  }
};
</script>
