<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;" :key="index">
                <Dropdown transfer v-if="item.leafFlag === '1'" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                </Dropdown>
                <Dropdown transfer v-if="item.children!=null && item.children.length >= 1" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <template v-for="child in item.children">
                        <DropdownMenu style="width: 200px;" slot="list">
                            <DropdownItem v-if="child.leafFlag ==='1'" :name="child.name" :key="child.id + index">
                                <Icon  :type="child.icon"></Icon>
                                <span style="padding-left:10px;">
                                    {{ itemTitle(child) }}
                                </span>
                            </DropdownItem>
                            <DropdownItem v-if="child.children!=null && child.children.length >= 1" :key="child.id + index">
                                <Dropdown transfer placement="right-start" :key="child.id" @on-click="changeMenu" >
                                    <DropdownItem style="margin-left:-15px;">
                                        <Icon :type="child.icon"></Icon>
                                        <span style="padding-left:10px;">
                                            {{ itemTitle(child) }}
                                        </span>
                                        <Icon type="ios-arrow-forward"></Icon>
                                    </DropdownItem>
                                    <DropdownMenu slot="list">
                                        <sidebar-menu-item
                                                v-if="child.children!=null && child.children.length >= 1"
                                                :menu-theme="menuTheme"
                                                :menu-list="child.children"
                                                @on-change="handleChange"
                                        ></sidebar-menu-item>
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownItem>
                        </DropdownMenu>
                    </template>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
import SidebarMenuItem from "./sidebarMenuItem";
export default {
    name: 'sidebarMenuShrink',
    components: {SidebarMenuItem},
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'dark'
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
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
    }
};
</script>
