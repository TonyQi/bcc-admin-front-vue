<template>
    <div class="search">
        <Card>
            <Row>
                <Button @click="addMenu" type="primary" icon="md-add">添加子节点</Button>
                <Button @click="addRootMenu" icon="md-add">添加一级菜单</Button>
                <Button @click="delAll"  icon="md-trash">删除</Button>

                <Button @click="refresh" icon="md-refresh">刷新</Button>
            </Row>
            <Row>
                <Col span="6">
                    <Card>
                        <Alert show-icon>
                            当前选择编辑：
                            <span class="select-title">{{editTitle}}</span>
                            <a class="select-clear" v-if="menuForm.title" @click="cancelEdit">取消选择</a>
                        </Alert>
                        <Tree
                                ref="tree"
                                :data="data"
                                :load-data="loadData"
                                children-key="children"
                                @on-select-change="selectTree">

                        </Tree>
                    </Card>
                </Col>
                <Col span="18">
                    <Card>
                        <Form :model="menuForm" :label-width="80">
                            <FormItem label="标题">
                                <Input v-model="menuForm.menuLabel"></Input>
                            </FormItem>
                            <FormItem label="路径">
                                <Input v-model="menuForm.menuUrl"></Input>
                            </FormItem>
                            <FormItem label="菜单英文名">
                                <Input v-model="menuForm.menuName"></Input>
                            </FormItem>
                            <FormItem label="图标" prop="icon">
                                <Input
                                        :icon="permissionForm.icon"
                                        placeholder="点击选择图标"
                                        v-model="menuForm.icon"
                                        @on-focus="showEditIcon(0)"
                                />
                            </FormItem>
                            <FormItem label="前端组件" prop="component">
                                <Input v-model="menuForm.uiEntry"/>
                            </FormItem>
                            <FormItem label="排序值" prop="sortOrder">
                                <InputNumber :max="1000" :min="0" v-model="menuForm.displayOrder"></InputNumber>
                                <span style="margin-left:5px">值越小越靠前，不支持小数</span>
                            </FormItem>
                        </Form>
                        <div style="text-align:center">
                            <Button @click="saveUpdateMenu" type="primary">保存</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
        <Modal title="新增菜单" v-model="menuModalVisible" :width="800" :styles="{top: '30px'}" footer-hide>
            <Row>
                <Form :model="permissionForm" :label-width="80">
                    <FormItem label="标题">
                        <Input v-model="permissionForm.menuLabel"></Input>
                    </FormItem>
                    <FormItem label="路径">
                        <Input v-model="permissionForm.menuUrl"></Input>
                    </FormItem>

                    <FormItem label="菜单英文名">
                        <Input v-model="permissionForm.menuName"></Input>
                    </FormItem>
                    <FormItem label="图标" prop="icon">
                        <Input
                                :icon="permissionForm.icon"
                                placeholder="点击选择图标"
                                v-model="permissionForm.icon"
                                @on-focus="showEditIcon(0)"
                        />
                    </FormItem>
                    <FormItem label="前端组件" prop="component">
                        <Input v-model="permissionForm.uiEntry"/>
                    </FormItem>
                    <FormItem label="排序值" prop="sortOrder">
                        <InputNumber :max="1000" :min="0" v-model="permissionForm.displayOrder"></InputNumber>
                        <span style="margin-left:5px">值越小越靠前，不支持小数</span>
                    </FormItem>
                    <FormItem label="是否叶子节点">
                        <i-switch size="large" v-model="permissionForm.leafFlag" :true-value="1" :false-value="0">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                </Form>
            </Row>
            <div style="text-align:center">
                <Button @click="saveMenu" type="primary">保存</Button>
                <Button @click="cancelAddMenu" type="text">取消</Button>
            </div>
        </Modal>
        <Modal title="选择图标" v-model="iconModalVisible" :width="800" :styles="{top: '30px'}" footer-hide>
            <icon-choose @on-select="handleSelectIcon"></icon-choose>
        </Modal>
    </div>
</template>

<script>
    import { getAllMenu,addMenu,delMenu,getMenuById,updateMenuById
    } from '@/api/index';
    import IconChoose from '@/views/my-components/icon-choose';
    import { Message,Col } from 'iview';
    export default {
        name: "menumanager",
        components: {
            Col,
            IconChoose,
            Message
        },
        data(){
            return{
                editTitle:"",
                searchKey:"",
                menuForm:{
                    title:""
                },
                iconModalVisible:false,
                menuModalVisible:false,
                iconType:0,
                data:[],
                permissionForm:{
                    title:"",
                    path:"",
                    displayOrder: 1,
                    leafFlag: 0

                },
                editTitle:""
            }
        },
        methods: {
            getAllMenuData(){
                const params = {};
                params.parentId="root";
                getAllMenu().then( res=>{
                        let array = res.data;
                        this.removeNullItem(array);
                        this.data =array;
                    }
                );
            },
            refresh(){
                this.getAllMenuData();
            },
            showEditIcon(v) {
                this.iconType = v;
                this.iconModalVisible = true;
            },
            handleSelectIcon(v) {
                this.permissionForm.icon = v;
                this.iconModalVisible = false;
            },
            addMenu(){
                const nodes = this.$refs.tree.getSelectedNodes();
                if(nodes && nodes.length >0){
                    this.menuModalVisible = true;
                    this.permissionForm.parentsId = nodes[0].id;
                }else{
                    Message.error("请先选择一个菜单！");
                }

            },
            addRootMenu(){
                this.menuModalVisible = true;
                this.permissionForm.parentsId = "root";
            },
            selectTree(item){
                if(item && item.length>0){
                    this.editTitle = item[0].title;
                    getMenuById(item[0].id).then(res=>{
                        res.data.leafFlag = parseInt(res.data.leafFlag);
                        this.permissionForm.icon = res.data.icon;
                        this.menuForm = res.data;
                    });
                }else{
                    this.editTitle = "";
                    this.menuForm = {};
                }
            },
            saveMenu(){
                addMenu(this.permissionForm).then(res=>{
                    this.$Notice.open({
                        title: '添加成功',
                        desc:  ''
                    });
                    this.menuModalVisible=false;
                    this.getAllMenuData();
                });

            },
            saveUpdateMenu(){
                updateMenuById(this.menuForm).then(res=>{
                    this.getAllMenuData();
                });
            },
            cancelAddMenu(){
                this.menuModalVisible=false;
            },
            delAll(){
                const nodes = this.$refs.tree.getSelectedNodes();
                if(nodes && nodes.length >0){
                    delMenu(nodes[0].id);
                }else{
                    Message.error("请先选择一个菜单！");
                }

            },
            cancelEdit(){

            },
            loadData(item, callback){

                const params = {};
                console.log(item.id);
                params.parentId=item.id;
                getAllMenu(item.id).then( res=>{
                        let array = res.data;
                        this.removeNullItem(array);
                        callback(array);
                    }
                );
            },
            removeNullItem(array){
                array.forEach(v=>{
                    if (v.loading === null) {
                        delete v.loading;
                    }
                });
            }
        },
        mounted(){
            this.getAllMenuData();
        }
    }
</script>