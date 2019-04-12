<template>
    <div>
        <DropdownItem transfer v-for="(item, index) in menuList"  placement="right-start" :key="index" @on-click="changeMenu">
            <template v-if="item.leafFlag === '1'">
                <Icon  :color="iconColor" :type="item.icon"></Icon>
                <span style="padding-left:10px;">
                    {{ itemTitle(item) }}
                </span>
            </template>
            <template v-if="item.children!=null && item.children.length >= 1">
                <Dropdown transfer placement="right-start" :key="index" @on-click="changeMenu">

                    <DropdownItem style="margin-left:-15px;">
                        <Icon  :color="iconColor" :type="item.icon"></Icon>
                        <span style="padding-left:10px;">
                            {{ itemTitle(item) }}
                        </span>
                        <Icon type="ios-arrow-forward"></Icon>
                    </DropdownItem>

                    <DropdownMenu slot="list">
                        <template v-for="child in item.children">
                            <DropdownItem v-if="child.leafFlag ==='1'" :name="child.name" :key="child.id">
                                <Icon :type="child.icon"></Icon>
                                <span style="padding-left:10px;">
                                    {{ itemTitle(child) }}
                                </span>
                            </DropdownItem>
                            <DropdownItem v-if="child.children!=null && child.children.length >= 1" :key="child.id + index">
                                <Dropdown transfer placement="right-start" :key="child.id" @on-click="changeMenu">
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
                                                :icon-color="iconColor"
                                                @on-change="handleChange"
                                        ></sidebar-menu-item>
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
            </template>
        </DropdownItem>
    </div>
</template>

<script>
    export default {
        name: "sidebarMenuItem",
        props: {
            menuList: {
                type: Array
            },
            iconColor: {
                type: String,
                default: '#515a6e'
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
    }
</script>

<style scoped>

</style>