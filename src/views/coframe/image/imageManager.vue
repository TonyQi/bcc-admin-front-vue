<template>
    <div style="search">
        <Card>
            <Row>
                <Col>
                    <Card>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="80">
                            <Form-item label="图片名称" prop="itemName">
                                <Input type="text" v-model="searchForm.itemName" clearable  placeholder="图片名称" />
                            </Form-item>
                            <Form-item label="上传人名称" prop="createUserName">
                                <Input type="text" v-model="searchForm.createUserName" clearable  placeholder="上传人名称" />
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
                    <Table :columns="imageColumn" :data="data1"></Table>
                </Col>
            </Row>
            <Row>
                <Page  :current="searchForm.pageIndex" :page-size="searchForm.pageSize" :total="total"  show-total @on-change="pageChange"/>
            </Row>
        </Card>
        <Modal title="图片展示" v-model="showModelVisiable" :width="400" :styles="{top: '30px'}" footer-hide>
                <Carousel autoplay loop>
                    <CarouselItem v-for="item in images">
                        <img style="width: 100%;height: 100%;" :src="item"/>

                    </CarouselItem>
                </Carousel>
        </Modal>
        <Modal title="图片添加" v-model="addModelVisiable" :width="400" :styles="{top: '30px'}" @on-ok="saveItem"  @on-cancel="cancelAdd">
            <Form ref="addForm" :model="addForm" inline :label-width="80">
                <Form-item label="图片名称" prop="itemName">
                    <Input type="text" v-model="addForm.itemName" clearable  placeholder="图片名称" style="width: 200px"/>
                </Form-item>
                <Form-item label="生效时间" prop="effectDate">
                    <DatePicker type="date" v-model="addForm.effectDate" placeholder="生效日期" style="width: 200px"></DatePicker>
                </Form-item>
            </Form>
            <Row>
                <div class="demo-upload-list" v-for="item in uploadList">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.id)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <Upload
                        ref="upload"
                        :headers="uploadHeader"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        type="drag"
                        action="/fileService/file/fileInfo/uploadAndSaveFileInfo"
                        style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;" v-if="addIconVisiable">
                        <Icon type="ios-camera" size="20" ></Icon>
                    </div>
                </Upload>
            </Row>
        </Modal>
        <Modal title="图片展示" v-model="picVisiable" footer-hide>
            <img :src="'/fileService/file/' + imgName " v-if="picVisiable" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    import {
        queryImageItems,
        getRequest,
        queryImagesByItemsId,
        saveFileInfo,
        delImages,
        saveImages,
        delImagesItem
    }from '@/api/index';
    import { getStore, setStore } from '@/libs/storage';
    export default {
        name: "imageManager",
        data(){
            return{
                picVisiable:false,
                searchForm:{
                    pageIndex:1,
                    pageSize: 10
                },
                total: 0,
                imageColumn:[
                    {
                        title: '图片名称',
                        key: 'itemName'
                    },
                    {
                        title: '生效日期',
                        key: 'effectDate'
                    },
                    {
                        title: '上传人名称',
                        key: 'createUserName'
                    },
                    {
                        title: '上传时间',
                        key: 'createDate'
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
                                                    this.showItems(params.row.id);
                                                }
                                            }
                                        },
                                        '查看'
                                    ),
                                    h('Button',{
                                            props: {
                                                type: 'error'
                                            },
                                            on: {
                                                click: () => {
                                                    this.remove(params.row.id);
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
                showModelVisiable:false,
                images:[],
                addModelVisiable:false,
                addForm:{},
                defaultList:[],
                uploadList:[],
                uploadHeader:{},
                imgName:'',
                addIconVisiable:true
            };
        },
        methods:{
            handleSearch(){
                queryImageItems(this.searchForm).then(res=>{
                    this.data1 = res.data.data;
                    this.total = res.data.total;
                });
            },
            handleReset(){
                this.searchForm={
                    pageIndex:1,
                    pageSize: 10
                };
            },
            handleAdd(){
                this.addForm={};
                this.addModelVisiable = true;
            },
            pageChange(pageIndex){
                this.searchForm.pageIndex = pageIndex;
                this.handleSearch();
            },
            remove(id){
                delImagesItem(id).then(res=>{
                    this.$Notice.success({
                        title: '删除成功',
                        desc:  ''
                    });
                    this.handleSearch();
                });
            },
            showItems(id){
                console.log(id);
                queryImagesByItemsId(id).then(res=>{
                    this.images= [];
                    res.data.images.forEach(v=>{
                        this.images.push('/base/front/'+v.imageId);
                    });
                });
                this.showModelVisiable =true;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件类型错误',
                    desc:  file.name + '文件类型错误，请选择 jpg 或 png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件大小超过限制',
                    desc: '文件  ' + file.name + ' 大小超过 2M.'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多能上传5张图片.'
                    });
                }
                if(this.uploadList.length >=5){
                    this.addIconVisiable =  true;
                }
                return check;
            },
            handleSuccess (res, file) {
                console.log(res);
                file.id = res.data.fileId;
                file.url = '/fileService/file/'+ res.data.fileId;
                file.name = res.data.fileName;
            },
            saveItem(){
                let effectDate =  this.addForm.effectDate;
                effectDate = this.dateFtt("yyyy-MM-dd hh:mm:ss",effectDate);
                this.addForm.effectDate = effectDate;
                let images =  [];
                this.uploadList.forEach(value => {
                    let image = {};
                    image.imageId = value.id;
                    image.fileName = value.name;
                    images.push(image);
                });
                this.addForm.images = images;
                saveImages(this.addForm).then(res=>{
                    console.log(res);
                    this.$Notice.success({
                        title: '添加成功.'
                    });
                    this.addModelVisiable = false;
                    this.handleSearch();
                });

            },
            cancelAdd(){
                this.addModelVisiable = false;
            },
            handleView(id){
                this.picVisiable = true;
                this.imgName = id;
            },
            handleRemove (file) {
                delImages(file.id).then(res=>{
                    const fileList = this.$refs.upload.fileList;
                    this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                });
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

        },
        mounted() {
            this.uploadList = this.$refs.upload.fileList;
            this.handleSearch();
            this.uploadHeader['X-ER-UAT'] = getStore('accessToken');
        }
    }
</script>

<style scoped>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>