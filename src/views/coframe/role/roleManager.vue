<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Form ref="searchForm" :model="searchForm" inline :label-width="70">
                        <Form-item label="角色编号" prop="positionCode">
                            <Input type="text" v-model="searchForm.positionCode" clearable  placeholder="请输入角色编号" />
                        </Form-item>
                        <Form-item label="角色名称" prop="positionName">
                            <Input type="text" v-model="searchForm.positionName" clearable  placeholder="请输入角色名称" />
                        </Form-item>

                        <Form-item style="margin-left:-35px;" class="br">
                            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                            <Button @click="handleReset">重置</Button>
                            <Button @click="handleAdd">增加</Button>
                        </Form-item>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table :columns="tellerColumn" :data="data1"></Table>
            </Col>
        </Row>
        <Row>
            <Page  :current="searchForm.pageIndex" :page-size="searchForm.pageSize" :total="total"  show-total @on-change="pageChange"/>
        </Row>
        <Modal :title="modelTitle" v-model="roleFormVisiable" :width="400" :styles="{top: '30px'}" footer-hide>
            <Row>
                <Form :model="roleForm" :label-width="80">
                    <FormItem label="角色编码">
                        <Input v-model="roleForm.positionCode" :disabled="codeAble"></Input>
                    </FormItem>
                    <FormItem label="角色名称">
                        <Input v-model="roleForm.positionName"></Input>
                    </FormItem>

                    <FormItem label="启用日期">
                        <DatePicker v-model="roleForm.effectDate" type="date" format="yyyy-MM-dd" style="width:288px"></DatePicker>
                    </FormItem>
                    <FormItem label="角色类别">
                        <Select v-model="roleForm.roleType" style="width:288px">
                            <Option v-for="item in roleTypeDict" :value="item.dictId" :key="item.dictId">{{ item.dictName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Row>
            <div style="text-align:center">
                <Button @click="saveRole" type="primary">保存</Button>
                <Button @click="cancelAddRole" type="text">取消</Button>
            </div>
        </Modal>
        <Modal title="角色权限配置" v-model="roleConfigVisiable" :width="400" :styles="{top: '30px'}" footer-hide>
            <Tree
                    ref="tree"
                    :data="data"
                    children-key="children"
                    show-checkbox
            >
            </Tree>
            <div style="text-align:center">
                <Button @click="saveConfig" type="primary">保存</Button>
                <Button @click="cancelConfig" type="text">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { queryAllRoles,
        getDictDataByDictId,
        saveRole,
        delRole,
        upRole,
        querMenusWithRoleCode,
        saveMenuAuthConfig
    } from '@/api/index';
    export default {
        name: "roleManager",
        data(){
            return {
                roleFormVisiable:false,
                roleConfigVisiable:false,
                codeAble:true,
                modelTitle: "",
                searchForm:{
                    positionCode: "",
                    positionName: "",
                    pageIndex:1,
                    pageSize: 10
                },
                tellerColumn:[
                    {
                        title: '角色编号',
                        key: 'positionCode'
                    },
                    {
                        title: '角色名称',
                        key: 'positionName'
                    },
                    {
                        title: '生效/启用日期',
                        key: 'effectDate'
                    },
                    {
                        title: '角色类型',
                        key: 'roleType',
                        render:(h,params) =>{
                            let type = params.row.roleType;
                            type = this.roleTypeDictMap[type];
                            return h('div',
                                type
                            )
                        }
                    },
                    {
                        title: '维护人员',
                        key: 'maininTeller'
                    },
                    {
                        title: '维护时间',
                        key: 'maininStamp',
                        render: (h, params) => {
                            let time = params.row.maininStamp;
                            time =  time.substring(0,4)+"-"+time.substring(4,6)+"-"+time.substring(6,8)+" "+time.substring(8,10)+":"+time.substring(10,12)+":"+time.substring(12,14);

                            return h('div',
                                time
                            )
                        }
                    },
                    {
                        title: '操作',
                        key:'action',
                        width: 250,
                        render:(h,params) =>{
                            return h('div',[
                                    h('Button',{
                                            props: {
                                                type:"warning"
                                            },
                                            style: {
                                                marginRight: '5px'
                                            },
                                            on: {
                                                click: () => {
                                                    this.handleConfig(params.row);
                                                }
                                            }
                                        },
                                        '配置权限'
                                    ),
                                    h('Button',{
                                            props: {
                                                type: 'primary'
                                            },
                                            style: {
                                                marginRight: '5px'
                                            },
                                            on: {
                                                click: () => {
                                                    this.handleUpdate(params.row);
                                                }
                                            }
                                        },
                                        '修改'
                                    ),
                                    h('Button',{
                                            props: {
                                                type: 'error'
                                            },
                                            on: {
                                                click: () => {
                                                    this.remove(params.row.positionCode);
                                                }
                                            }
                                        },
                                        '删除'
                                    ),
                                ]
                            );
                        }
                    }

                ],
                data1:[],
                total: 0,
                roleForm:{},
                roleTypeDict:[],
                roleTypeDictMap:{},
                data:[],
                roleCode:''
            }

        },
        methods:{
            handleSearch(){
                queryAllRoles(this.searchForm).then(res=>{
                    this.data1 = res.data.data;
                    this.total = res.data.total;
                });
            },
            handleReset(){
                this.searchForm = {
                    positionCode: "",
                    positionName: "",
                    pageIndex:1,
                    pageSize: 10
                };
            },
            pageChange(pageIndex){
                this.searchForm.pageIndex = pageIndex;
                this.handleSearch();
            },
            getRoleTypeDict(){
                getDictDataByDictId('jslx').then(res =>{
                    if (res.code ==="000000") {
                        this.roleTypeDict=res.data;
                        res.data.forEach( v =>{
                            this.roleTypeDictMap[v.dictId] = v.dictName;
                        });
                    }

                })
            },
            handleAdd(){
                this.codeAble =false;
                this.roleForm = {};
                this.roleFormVisiable = true;
                this.modelTitle ='新增角色';
            },
            handleUpdate(role){
                this.roleForm = role ;
                this.roleFormVisiable = true;
                this.codeAble =true;
                this.modelTitle ='修改角色';
            },
            saveRole(){
                this.roleForm.effectDate = this.dateFtt("yyyyMMdd",this.roleForm.effectDate);
                if (!this.codeAble) {
                    saveRole(this.roleForm).then(res=>{
                        this.$Notice.success({
                            title: '添加成功',
                            desc:  ''
                        });
                        this.handleSearch();
                        this.roleFormVisiable = false;
                    });
                }else{
                    upRole(this.roleForm).then(res=>{
                        this.$Notice.success({
                            title: '修改成功',
                            desc:  ''
                        });
                        this.handleSearch();
                        this.roleFormVisiable = false;
                    });
                }


            },
            cancelAddRole(){
                this.roleFormVisiable = false;
            },
            dateFtt(fmt,date){ //author: meizz
                var o = {
                    "M+" : date.getMonth()+1,                 //月份
                    "d+" : date.getDate(),                    //日
                    "h+" : date.getHours(),                   //小时
                    "m+" : date.getMinutes(),                 //分
                    "s+" : date.getSeconds(),                 //秒
                    "q+" : Math.floor((date.getMonth()+3)/3), //季度
                    "S"  : date.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("("+ k +")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                return fmt;
            },
            remove(positionCode){
                delRole(positionCode).then(res=>{
                    this.$Notice.success({
                        title: '删除成功',
                        desc:  ''
                    });
                    this.handleSearch();
                });
            },
            handleConfig(row){
                this.roleCode = row.positionCode;
                querMenusWithRoleCode(row.positionCode).then(res=>{
                    this.data = res.data;

                });
                this.roleConfigVisiable = true;
            },
            removeNullItem(array){
                array.forEach(v=>{
                    if (v.loading === null) {
                        delete v.loading;
                    }
                });
            },
            saveConfig(){
                let checkedenus = this.$refs.tree.getCheckedNodes();
                saveMenuAuthConfig(checkedenus,this.roleCode).then(res =>{
                    this.$Notice.success({
                        title: '权限配置成功',
                        desc:  ''
                    });
                });
                this.roleConfigVisiable = false;
            },
            cancelConfig(){
                this.roleConfigVisiable = false;
            }

        },
        mounted() {
            this.handleSearch();
            this.getRoleTypeDict();
        }
    }
</script>

<style scoped>

</style>