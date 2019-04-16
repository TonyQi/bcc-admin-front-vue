<template>
    <div>
        <Card>
            <Row>
                <Col span="12">
                    <Card>
                        <Row>
                            <Form ref="searchForm" :model="searchForm" inline :label-width="70">
                                <Form-item label="类型编码" prop="tlrno">
                                    <Input type="text" v-model="searchForm.ictTypeId" clearable  placeholder="" />
                                </Form-item>
                                <Form-item label="类型名称" prop="tlrname">
                                    <Input type="text" v-model="searchForm.dictTypeName" clearable  placeholder="" />
                                </Form-item>
                            </Form>
                        </Row>
                        <Row>
                            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                            <Button @click="handleReset">重置</Button>
                            <Button @click="handleAdd">增加</Button>
                        </Row>
                        <Row>
                            <Table :columns="dictTypeColumn" :data="dataTypeData" @on-row-click="dictTypeRowClick"></Table>
                        </Row>
                        <Row>
                            <Page  :current="searchForm.pageIndex" :page-size="searchForm.pageSize" :total="total"  show-total @on-change="pageChange"/>
                        </Row>
                    </Card>
                </Col>
                <Col span="12">
                    <Card>
                        <Row>
                            <Button @click="handleItemAdd">增加</Button>
                        </Row>
                        <Row>
                            <Table :columns="dictColumn" :data="dictData"></Table>
                        </Row>
                        <Row>
                            <Page  :current="dictItemSearchForm.pageIndex" :page-size="dictItemSearchForm.pageSize" :total="dictItemsTotal"  show-total @on-change="dictItempageChange"/>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Card>
        <Modal v-model="showDictTypeForm" :title="typeFormTitle" @on-ok="saveTypeFrom">
            <Form :model="dictTypeFrom" :label-width="80">
                <FormItem label="类型编码：">
                    <Input v-model="dictTypeFrom.dictTypeId" ></Input>
                </FormItem>
                <FormItem label="类型名称：">
                    <Input v-model="dictTypeFrom.dictTypeName"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="showDictItemForm" :title="itemFormTitle" @on-ok="saveItemFrom">
            <Form :model="dictItemFrom" :label-width="90">
                <FormItem label="类型编码：">
                    <Input v-model="dictItemFrom.dictTypeId" ></Input>
                </FormItem>
                <FormItem label="字典项代码：">
                    <Input v-model="dictItemFrom.dictId"></Input>
                </FormItem>
                <FormItem label="字典项名称：">
                    <Input v-model="dictItemFrom.dictName"></Input>
                </FormItem>
                <FormItem label="排序值：">
                    <InputNumber v-model="dictItemFrom.sortNo"></InputNumber>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import{queryDictTypes,
        queryDictItems,
        saveAddTypeFrom,
        saveUpTypeFrom,
        delDictType,
        saveAddDictItem,
        saveUpdateDictItem,
        delDictItem
    } from '@/api/index';
    export default {
        name: "dictManager",
        data(){
            return {
                total: 0,
                searchForm:{
                    pageIndex:1,
                    pageSize: 10
                },
                showDictTypeForm: false,
                typeFormTitle:"",
                typeFromType:"",
                showDictItemForm: false,
                itemFormTitle: '',
                itemFromType:'',
                dictTypeColumn:[
                    {
                        title: '类型代码',
                        key: 'dictTypeId'
                    },
                    {
                        title: '类型名称',
                        key: 'dictTypeName'
                    },
                    {
                        title: '操作',
                        key:'action',
                        render:(h,params) =>{
                            return h('div',[
                                    h('Button',{
                                            props: {
                                                type: 'primary'
                                            },
                                            style: {
                                                marginRight: '5px'
                                            },
                                            on: {
                                                click: () => {
                                                    this.handleUpdateType(params.row);
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
                                                    this.remove(params.row);
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
                dataTypeData:[],
                dictColumn:[
                    {
                        title: '字典项代码',
                        key: 'dictId'
                    },
                    {
                        title: '字典项名称',
                        key: 'dictName'
                    },
                    {
                        title: '排序值',
                        key: 'sortNo'
                    },
                    {
                        title: '操作',
                        key:'action',
                        width: 200,
                        render:(h,params) =>{
                            return h('div',[
                                    h('Button',{
                                            props: {
                                                type: 'primary'
                                            },
                                            style: {
                                                marginRight: '5px'
                                            },
                                            on: {
                                                click: () => {
                                                    this.handleUpdateItem(params.row);
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
                                                    this.removeItem(params.row);
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
                dictData:[],
                dictItemSearchForm:{
                    pageIndex:1,
                    pageSize: 10
                },
                dictItemsTotal:0,
                dictTypeFrom:{},
                dictItemFrom:{},
                dictTypeSelected:{}
            }
        },
        methods:{
            handleSearch(){
                queryDictTypes(this.searchForm).then(res=>{
                    this.dataTypeData =  res.data.data;
                    this.total =  res.data.total;
                });
            },
            handleReset(){
                this.searchForm ={
                    pageIndex:1,
                    pageSize: 10
                };
            },
            handleUpdateType(dictType){
                this.dictTypeFrom = dictType;
                this.showDictTypeForm = true;
                this.typeFormTitle = "数据字典类型修改";
                this.typeFromType = 'UPDATE';
            },
            remove(dictType){
                let arrays = [];
                arrays.push(dictType)
                delDictType(arrays).then(res=>{
                    this.$Notice.success({
                        title: '删除成功',
                        desc: ''
                    });
                    this.handleSearch();
                });
            },
            pageChange(pageIndex){
                this.searchForm.pageIndex = pageIndex;
                this.handleSearch();
            },
            handleAdd(){
                this.showDictTypeForm = true;
                this.typeFormTitle = "数据字典类型新增";
                this.typeFromType = 'ADD';

            },
            dictTypeRowClick(row,index){
                this.dictItemSearchForm = {
                    pageIndex:1,
                    pageSize: 10
                };
                this.dictTypeSelected = row;
                this.dictItemSearchForm.dictTypeId = row.dictTypeId;
                queryDictItems(this.dictItemSearchForm).then(res=>{
                    this.dictData=res.data.data;
                    this.dictItemsTotal= res.data.total;
                });
            },
            dictItempageChange(index){
                this.dictItemSearchForm.pageIndex=index;
                queryDictItems(row.dictTypeId).then(res=>{
                    this.dictData=res.data.data;
                    this.dictItemsTotal= res.data.total;
                });
            },
            handleItemAdd(){
                this.showDictItemForm =  true;
                this.itemFormTitle = "增加字典项";
                this.dictItemFrom ={};
                this.dictItemFrom.dictTypeId= this.dictTypeSelected.dictTypeId;
                this.itemFromType = 'ADD';

            },
            saveTypeFrom(){
                if (this.typeFromType ==='ADD'){
                    saveAddTypeFrom(this.dictTypeFrom).then(res=>{
                        this.$Notice.success({
                            title: '添加成功',
                            desc: ''
                        });
                        this.showDictTypeForm = false;
                        this.handleSearch();
                    });
                }else{
                    saveUpTypeFrom(this.dictTypeFrom).then(res=>{
                        this.$Notice.success({
                            title: '修改成功',
                            desc: ''
                        });
                        this.showDictTypeForm = false;
                        this.handleSearch();
                    })
                }
            },
            saveItemFrom(){
                if (this.itemFromType==='ADD'){
                    saveAddDictItem(this.dictItemFrom).then(res=>{
                        this.$Notice.success({
                            title: '添加成功',
                            desc: ''
                        });
                        this.showDictItemForm = false;
                        this.dictItemSearchForm.dictTypeId = this.dictTypeSelected.dictTypeId;
                        queryDictItems(this.dictItemSearchForm).then(res=>{
                            this.dictData=res.data.data;
                            this.dictItemsTotal= res.data.total;
                        });
                    });
                }else {
                    saveUpdateDictItem(this.dictItemFrom).then(res=>{
                        this.$Notice.success({
                            title: '修改成功',
                            desc: ''
                        });
                        this.showDictItemForm = false;
                        this.dictItemSearchForm.dictTypeId = this.dictTypeSelected.dictTypeId;
                        queryDictItems(this.dictItemSearchForm).then(res=>{
                            this.dictData=res.data.data;
                            this.dictItemsTotal= res.data.total;
                        });
                    });
                }
            },
            handleUpdateItem(item){
                this.dictItemFrom = item;
                this.showDictItemForm = true;
                this.itemFromType = "UPDATE";
            },
            removeItem(item){
                let array = [];
                array.push(item);
                delDictItem(array).then(res=>{
                    this.dictItemSearchForm.dictTypeId = this.dictTypeSelected.dictTypeId;
                    queryDictItems(this.dictItemSearchForm).then(res=>{
                        this.$Notice.success({
                            title: '删除成功',
                            desc: ''
                        });
                        this.dictData=res.data.data;
                        this.dictItemsTotal= res.data.total;
                    });
                });
            }

        },
        mounted() {
            this.handleSearch();
        }
    }
</script>
<style scoped>

</style>