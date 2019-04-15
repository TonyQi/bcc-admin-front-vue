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
                            <Button @click="handleAdd">增加</Button>
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
    </div>
</template>

<script>
    import{queryDictTypes,
        queryDictItems
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
                                                    this.handleUpdateType(params.row.tlrno);
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
                                                    this.remove(params.row.tlrno);
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
                                                    this.handleUpdateType(params.row.tlrno);
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
                                                    this.remove(params.row.tlrno);
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
                dictItemsTotal:0
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

            },
            remove(dictType){

            },
            pageChange(pageIndex){
                this.searchForm.pageIndex = pageIndex;
                this.handleSearch();
            },
            handleAdd(){

            },
            dictTypeRowClick(row,index){
                this.dictItemSearchForm = {
                    pageIndex:1,
                    pageSize: 10
                };
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
            }

        },
        mounted() {
            this.handleSearch();
        }
    }
</script>
<style scoped>

</style>