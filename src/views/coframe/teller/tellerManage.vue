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
    import { getTellerList,
             resetTellerPasswd,
             delTeller,
             getDictDataByDictId
            } from '@/api/index';
    import { Message } from 'iview';
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
                        key: 'sex',
                        render: (h, params) => {
                            let icon = "";
                            let color= "";
                            let sex = params.row.sex;
                            if (sex ==="1"){
                                icon ="ios-man";
                                color = "#5cadff";
                            }else{
                                icon = "ios-woman";
                                color = "pink";
                            }
                            return h('div',[
                                    h('Icon',
                                        {
                                            props: {
                                                type: icon,
                                                color: color
                                            }
                                        }
                                    )
                                ]

                            )
                        }
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
                        key: 'tlrstat',
                        render: (h, params) => {
                            let color= "";
                            let stat = params.row.tlrstat;
                            let statstring = this.tellerStateDict[stat];

                            if (stat ==="01"){
                                color = "success";
                            }else{
                                color = "red";
                            }
                            return h('div',[

                                    h('Tag',
                                        {
                                            props: {
                                                color: color
                                            }
                                        },
                                        statstring
                                    )
                                ]

                            )
                        }
                    },
                    {
                        title: '维护时间',
                        key: 'opertimestamp',
                        render: (h, params) => {
                            let time = params.row.opertimestamp;
                            time =  time.substring(0,4)+"-"+time.substring(4,6)+"-"+time.substring(6,8)+" "+time.substring(8,10)+":"+time.substring(10,12)+":"+time.substring(12,14);

                            return h('div',
                                time
                            )
                        }
                    },
                    {
                        title: '操作',
                        key:'action',
                        width: 190,
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
                                                    this.handleResetPwd(params.row.tlrno);
                                                }
                                            }
                                        },
                                        '重置密码'
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
                data1:[],
                tellerStateDict:{}
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

            },
            handleResetPwd(tellerno){
                let teller={};
                teller.tlrno= tellerno;
                let tellers = [];
                tellers.push(teller)
                resetTellerPasswd(tellers).then(res=>{
                    if(res.code ==="000000"){
                        this.$Notice.success({
                            title: '操作成功',
                            desc: ''
                        });
                    }else{
                        this.$Notice.error({
                            title: '操作失败',
                            desc: ''
                        });
                    }
                });
            },
            remove(tellerno){
                let teller={};
                teller.tlrno= tellerno;
                let tellers = [];
                tellers.push(teller);
                delTeller(tellers).then(res=>{
                    if(res.code ==="000000"){
                        this.$Notice.success({
                            title: '操作成功',
                            desc: ''
                        });
                        this.handleSearch(this.searchForm)
                    }else{
                        this.$Notice.error({
                            title: '操作失败',
                            desc: ''
                        });
                    }
                });
            },
            getTellerStateDict(){
                getDictDataByDictId('Tlr_Stat').then(res =>{
                    if (res.code ==="000000") {
                        res.data.forEach( v =>{
                           this.tellerStateDict[v.dictId] = v.dictName;
                        });
                    }

                })
            }
        },
        mounted() {
            this.getTellerStateDict();
            this.handleSearch(this.searchForm);
        }
    };
</script>