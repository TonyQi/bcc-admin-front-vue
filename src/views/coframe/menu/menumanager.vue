<template>
    <div class="search">
        <Card>
            <Row>
                <Button @click="addMenu" type="primary" icon="md-add">添加子节点</Button>
                <Button @click="addRootMenu" icon="md-add">添加一级菜单</Button>
                <Button @click="delAll" icon="md-trash">删除</Button>
                <Dropdown @on-click="handleDropdown">
                    <Button>更多操作
                        <Icon type="md-arrow-dropdown"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="refresh">刷新</DropdownItem>
                        <DropdownItem name="expandOne">仅显示一级</DropdownItem>
                        <DropdownItem name="expandTwo">仅展开两级</DropdownItem>
                        <DropdownItem name="expandAll">展开所有</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Row>
            <Row>
                <Col span="6">
                    <Card>
                        <Alert show-icon>
                            当前选择编辑：
                            <span class="select-title">{{editTitle}}</span>
                            <a class="select-clear" v-if="menuForm.title" @click="cancelEdit">取消选择</a>
                        </Alert>
                        <Input
                                v-model="searchKey"
                                suffix="ios-search"
                                @on-change="search"
                                placeholder="输入菜单名搜索"
                                clearable
                        />
                        <Tree
                                ref="tree"
                                :data="data"
                                @on-check-change="changeSelect"
                                @on-select-change="selectTree">

                        </Tree>
                    </Card>
                </Col>
                <Col span="18">
                    <Card>
                        <Form :model="permissionForm" :label-width="80">
                            <FormItem label="标题">
                                <Input v-model="permissionForm.title"></Input>
                            </FormItem>
                            <FormItem label="路径">
                                <Input v-model="permissionForm.path"></Input>
                            </FormItem>
                            <FormItem label="图标">
                                <Input v-model="permissionForm.icon"></Input>
                            </FormItem>
                            <FormItem label="菜单英文名">
                                <Input v-model="permissionForm.name"></Input>
                            </FormItem>
                            <FormItem label="图标" prop="icon">
                                <Input
                                        :icon="menuForm.icon"
                                        placeholder="点击选择图标"
                                        v-model="menuForm.icon"
                                        @on-focus="showEditIcon(0)"
                                />
                            </FormItem>
                            <FormItem label="前端组件" prop="component">
                                <Input v-model="menuForm.component"/>
                            </FormItem>
                            <FormItem label="排序值" prop="sortOrder">
                                <InputNumber :max="1000" :min="0" v-model="menuForm.sortOrder"></InputNumber>
                                <span style="margin-left:5px">值越小越靠前，支持小数</span>
                            </FormItem>
                            <FormItem label="是否启用" prop="status">
                                <i-switch size="large" v-model="menuForm.status" :true-value="0" :false-value="-1">
                                    <span slot="open">启用</span>
                                    <span slot="close">禁用</span>
                                </i-switch>
                            </FormItem>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Card>
        <Modal title="选择图标" v-model="iconModalVisible" :width="800" :styles="{top: '30px'}" footer-hide>
            <icon-choose @on-select="handleSelectIcon"></icon-choose>
        </Modal>
    </div>
</template>

<script>
    import { getAllMenu
    } from '@/api/index';
    import IconChoose from '@/views/my-components/icon-choose';

    export default {
        name: "menumanager",
        components: {
            IconChoose
        },
        data(){
            return{
                editTitle:"",
                menuForm:{
                    title:""
                },
                iconModalVisible:false,
                iconType:0,
                data:[],
                permissionForm:{
                    title:"",
                    path:""
                }


            }
        },
        methods: {
            getAllMenuData(){
                getAllMenu().then( res=>{
                        this.data =res.data;
                    }
                );
            },
            showEditIcon(v) {
                this.iconType = v;
                this.iconModalVisible = true;
            },
            handleSelectIcon(v) {
                this.menuForm.icon = v;
                this.iconModalVisible = false;
            }
        },
        mounted(){
            this.getAllMenuData();
        }
    }
</script>