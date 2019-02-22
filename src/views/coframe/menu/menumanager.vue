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
                            <a class="select-clear" v-if="menuForm.id" @click="cancelEdit">取消选择</a>
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

                    </Card>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "menumanager",
        data(){
            return{
                editTitle:"",
                menuForm:{
                    id:""
                },
                data:[
                    {
                        title:"aaa"
                    },
                    {
                        title:"bbb"
                    }
                ]


            }
        }
    }
</script>