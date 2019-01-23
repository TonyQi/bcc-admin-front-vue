<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Form ref="searchForm" :model="searchForm" inline :label-width="70">
                        <Form-item label="人员编号" prop="tlrno">
                            <Input type="text" v-model="searchForm.tlrno" clearable  placeholder="请输入人员编号" />
                        </Form-item>
                        <Form-item label="人员名称" prop="tlrname">
                            <Input type="text" v-model="searchForm.tlrname" clearable  placeholder="请输入人员名称" />
                        </Form-item>
                        <Form-item style="margin-left:-35px;" class="br">
                            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                            <Button @click="handleReset">重置</Button>
                            <Button @click="handleReset">增加</Button>
                            <Button @click="handleReset">编辑</Button>
                            <Button @click="handleReset">密码重置</Button>
                            <Button @click="handleReset">删除</Button>
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
            <Page  :current="searchForm.pageIndex" :page-size="searchForm.pageSize" :total="total"  show-total />
        </Row>
    </div>
</template>

<script>
    import { getTellerList } from '@/api/index';
    export default {
        name: "user-manage",
        components: {
        },
        data() {
            return {
                drop: false,
                total: 0,
                dropDownIcon:"md-arrow-dropdown",
                searchForm: {
                    tlrno: "",
                    tlrname: "",
                    pageIndex:1,
                    pageSize: 10
                },
                tellerColumn:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '人员编号',
                        key: 'tlrno'
                    },
                    {
                        title: '人员名称',
                        key: 'tlrname'
                    },
                    {
                        title: '性别',
                        key: 'sex'
                    },
                    {
                        title: '固定电话',
                        key: 'telephone'
                    },
                    {
                        title: '手机号码',
                        key: 'mobilephone'
                    },
                    {
                        title: '电子邮件',
                        key: 'email'
                    },
                    {
                        title: '所属机构编码',
                        key: 'instno'
                    },
                    {
                        title: '人员状态',
                        key: 'tlrstat'
                    },
                    {
                        title: '维护时间',
                        key: 'opertimestamp'
                    },
                ],
                data1:[]
            }
        },
        methods: {
            handleSearch(){
                getTellerList(this.searchForm).then(res => {
                    if(res.code ==="000000"){
                        this.data1 = res.data.data;
                        this.total= res.data.total;
                    }
                });
            },
            handleReset(){

            },
            dropDown(){
                if(!this.drop){
                    this.dropDownIcon="md-arrow-dropup";
                }else{
                    this.dropDownIcon="md-arrow-dropdown";
                }
                this.drop = !this.drop;

            }
        },
        mounted() {
            this.handleSearch(this.searchForm);
        }
    };
</script>