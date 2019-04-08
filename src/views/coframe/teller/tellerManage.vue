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
        <Modal v-model="showForm" :title="formTitle" width="700" :loading="loading" @on-ok="onOK">
                <Form :model="tellerFrom" :label-width="120" inline>
                    <Row>
                        <FormItem label="人员编号">
                            <Input v-model="tellerFrom.tlrno" disabled></Input>
                        </FormItem>
                        <FormItem label="机构编码">
                            <Input v-model="tellerFrom.instno" disabled></Input>
                        </FormItem>
                        <FormItem label="身份证号码">
                            <Input v-model="tellerFrom.idcode"></Input>
                        </FormItem>
                        <FormItem label="人员名称">
                            <Input v-model="tellerFrom.tlrname"></Input>
                        </FormItem>
                        <FormItem label="手机号码">
                            <Input v-model="tellerFrom.mobilephone"></Input>
                        </FormItem>
                        <FormItem label="性别">
                            <Select v-model="tellerFrom.sex" style="width:141px">
                                <Option v-for="item in sexDict" :value="item.dictId" :key="item.dictId">{{ item.dictName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="合同期限类型">
                            <Select v-model="tellerFrom.contracttype" style="width:141px">
                                <Option v-for="item in contractTypeDict" :value="item.dictId" :key="item.dictId">{{ item.dictName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="用工性质">
                            <Select v-model="tellerFrom.engagekind" style="width:141px">
                                <Option v-for="item in engageKindDict" :value="item.dictId" :key="item.dictId">{{ item.dictName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="出生日期">
                            <DatePicker v-model="tellerFrom.birthday" type="date" format="yyyy-MM-dd" style="width:141px"></DatePicker>
                        </FormItem>
                        <FormItem label="学历">
                            <Select v-model="tellerFrom.educationalbak" style="width:141px">
                                <Option v-for="item in educationalDict" :value="item.dictId" :key="item.dictId">{{ item.dictName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="岗位">
                            <Select v-model="tellerFrom.post" style="width:141px">
                                <Option v-for="item in tlrPostDict" :value="item.dictId" :key="item.dictId">{{ item.dictName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="人员类别">
                            <Select v-model="tellerFrom.tlrtype" style="width:141px">
                                <Option v-for="item in tlrTypeDict" :value="item.dictId" :key="item.dictId">{{ item.dictName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="参加工作日期">
                            <DatePicker v-model="tellerFrom.beginjobdate" type="date" format="yyyy-MM-dd" style="width:141px"></DatePicker>
                        </FormItem>
                        <FormItem label="入行工作日期">
                            <DatePicker v-model="tellerFrom.joinbankdate" type="date" format="yyyy-MM-dd" style="width:141px"></DatePicker>
                        </FormItem>
                        <FormItem label="合同起始日期">
                            <DatePicker v-model="tellerFrom.begincondate" type="date" format="yyyy-MM-dd" style="width:141px"></DatePicker>
                        </FormItem>
                        <FormItem label="合同终止日期">
                            <DatePicker v-model="tellerFrom.endcondate" type="date" format="yyyy-MM-dd" style="width:141px"></DatePicker>
                        </FormItem>
                        <FormItem label="固定电话">
                            <Input v-model="tellerFrom.telephone" ></Input>
                        </FormItem>
                        <FormItem label="电子邮箱">
                            <Input v-model="tellerFrom.email" type="email"></Input>
                        </FormItem>
                    </Row>
                </Form>
        </Modal>
    </div>

</template>

<script>
    import { getTellerList,
             resetTellerPasswd,
             delTeller,
             getDictDataByDictId,
             getMaxTellerId,
             addTeller,
             upTeller
            } from '@/api/index';
    import Cookies from "js-cookie";
    export default {
        name: "user-manage",
        components: {
        },
        data() {
            return {
                loading:true,
                formType:"",
                drop: false,
                total: 0,
                dropDownIcon:"md-arrow-dropdown",
                searchForm: {
                    tlrno: "",
                    tlrname: "",
                    pageIndex:1,
                    pageSize: 10
                },
                tellerFrom:{
                    tlrno:"",
                    instno:"",
                    idcode:"",
                    tlrname:"",
                    mobilephone:"",
                    sex:"",
                    contracttype:"",
                    engagekind:"",
                    birthday:"",
                    educationalbak:"",
                    post:"",
                    tlrtype:"",
                    beginjobdate:"",
                    joinbankdate:"",
                    begincondate:"",
                    endcondate:"",
                    telephone:"",
                    email:""
                },
                tellerColumn:[
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
                        width: 250,
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
                                                    this.handleUpdate(params.row.tlrno);
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
                data1:[],
                tellerStateDict:{},
                sexDict:[],
                contractTypeDict:[],
                engageKindDict:[],
                educationalDict:[],
                tlrPostDict:[],
                tlrTypeDict:[],
                showForm: false,
                formTitle:''
            }
        },
        methods: {
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
            },

            getTellerSexDict(){
                getDictDataByDictId('Sex').then(res =>{
                    if (res.code ==="000000") {
                        this.sexDict=res.data;
                    }
                })
            },
            getTellerConterTypeDict(){
                getDictDataByDictId('BC_TLR_CONTRATYPE').then(res =>{
                    if (res.code ==="000000") {
                        this.contractTypeDict=res.data;
                    }
                })
            },
            getEngageKindTypeDict(){
                getDictDataByDictId('Engage_Kind').then(res =>{
                    if (res.code ==="000000") {
                        this.engageKindDict=res.data;
                    }
                })
            },
            getEducationDict(){
                getDictDataByDictId('Educationalbak').then(res =>{
                    if (res.code ==="000000") {
                        this.educationalDict=res.data;
                    }
                })
            },
            getTlrPostDict(){
                getDictDataByDictId('BC_TLR_POST').then(res =>{
                    if (res.code ==="000000") {
                        this.tlrPostDict=res.data;
                    }
                });
            },
            getTlrTypeDict(){
                getDictDataByDictId('Tlr_Type').then(res =>{
                    if (res.code ==="000000") {
                        this.tlrTypeDict=res.data;
                    }
                });
            },
            getNextTlrNo(){
                getMaxTellerId().then(res=>{
                    if (res.code ==="000000"){
                        this.tellerFrom.tlrno= res.data;
                    }
                })
            },

            handleAdd(){
                this.showForm=true;
                this.formTitle = '人员添加';
                this.tellerFrom={
                    tlrno:"",
                    instno:"",
                    idcode:"",
                    tlrname:"",
                    mobilephone:"",
                    sex:"",
                    contracttype:"",
                    engagekind:"",
                    birthday:"",
                    educationalbak:"",
                    post:"",
                    tlrtype:"",
                    beginjobdate:"",
                    joinbankdate:"",
                    begincondate:"",
                    endcondate:"",
                    telephone:"",
                    email:""
                };
                this.getNextTlrNo();
                this.tellerFrom.instno = Cookies.get("groupId");
                this.formType ="add";


            },
            handleUpdate(tellerno){
                this.showForm=true;
                this.formTitle = '修改'+tellerno;
                let temp ={};
                temp.tlrno=tellerno;
                temp.pageIndex=1,
                    temp.pageSize=10;
                getTellerList(temp).then(res => {
                    if(res.code ==="000000"){
                        this.tellerFrom = res.data.data[0];
                    }
                });
            },
            onOK(){
                for (let i in this.tellerFrom) {
                    if (this.tellerFrom[i] instanceof Date) {
                        let date = this.tellerFrom[i];
                        date = this.dateFtt('yyyyMMdd',date);
                        this.tellerFrom[i] = date;
                    }
                }

                if(this.formType==="add"){
                    addTeller(this.tellerFrom).then(res =>{
                        this.showForm = false;
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
                    })
                }else {
                    upTeller(this.tellerFrom).then(res =>{
                        this.showForm = false;
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
                }
                this.handleSearch(this.searchForm);
            },
            pageChange(pageIndex){
                this.searchForm.pageIndex = pageIndex;
                this.handleSearch();
            }
        },
        mounted() {
            this.getTellerStateDict();
            this.handleSearch(this.searchForm);
            this.getTellerSexDict();
            this.getTellerConterTypeDict();
            this.getEngageKindTypeDict();
            this.getEducationDict();
            this.getTlrPostDict();
            this.getTlrTypeDict();
        }
    };
</script>