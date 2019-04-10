<style lang="less">
@import "../styles/menu.less";
</style>
<template>
    <Menu ref="sideMenu" accordion :active-name="$route.name" :open-names="singleOpenName" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="item.leafFlag === '1'" :name="item.name" :key="'menuitem' + item.name">
                <Icon :type="item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item) }}</span>
            </MenuItem>
            <Submenu v-if="item.children!=null && item.children.length >= 1" :name="item.name" :key="item.name">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <Submenu v-if="child.leafFlag !='1'" :name="child.name" :key="child.name">
                        <template slot="title">
                            <Icon :type="child.icon" :size="iconSize"></Icon>
                            <span class="layout-text">{{ itemTitle(child) }}</span>
                        </template>
                        <sidebar-menu
                                :menu-theme="menuTheme"
                                :menu-list="child.children"
                                :open-names="openNames"
                                @on-change="handleChange"
                        ></sidebar-menu>
                    </Submenu>
                    <MenuItem v-if="child.leafFlag === '1'" :name="child.name" :key="'menuitem' + child.name">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
  name: "sidebarMenu",
  data() {
    return {
      singleOpenName: []
    };
  },
  props: {
    menuList: Array,
    iconSize: Number,
    menuTheme: {
      type: String,
      default: "dark"
    },
    openNames: {
      type: Array
    }
  },
  methods: {
    changeMenu(active) {
      this.$emit("on-change", active);
    },
    handleSelect(name) {
      this.$emit("on-select", name);
    },
    itemTitle(item) {
      if (typeof item.title === "object") {
        return this.$t(item.title.i18n);
      } else {
        return item.title;
      }
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched
        .map(item => item.name)
        .filter(item => item !== name);
    },
    handleChange (name) {
      let willpush = true;
      if (this.beforePush !== undefined) {
          if (!this.beforePush(name)) {
              willpush = false;
          }
      }
      if (willpush) {
          this.$router.push({
              name: name
          });
      }
      this.$emit('on-change', name);
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      this.singleOpenName = [this.$route.matched[0].name];
    }
  },
  mounted() {
    this.singleOpenName = [this.$route.matched[0].name];
  }
};
</script>
<style scoped="scoped">

</style>
