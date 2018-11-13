<template>
    <div class="list_page">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="4">

            <h2 class="com_header">资源接口</h2>
            </Col>

            <Col span="2" class="operation">

            <Input size="large" v-model="searchWord" placeholder="请输入资源名称..." class="com_search"/>
            <Button type="primary" @click="searchChange">
                <Icon type="md-search" style="font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="res_add" v-if="adds">新增资源</Button>
            </Col>
        </Row>
        <Table border :columns="columns1" :data="data1" id="table1" :loading='SpinType'
               class="com_table"></Table>
        <Page class="paging" :total="total" :page-size="page.pageSize" :current="page.pageIndex" @on-change="totol"
              show-total/>
    </div>
</template>
<style scoped>
</style>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import Delete from '../../common/delete/Delete.vue';
    import Edit from '../../common/edit/Edit.vue';


    export default {
        inject: ['reload'],
        data () {
            return {
                SpinType: false,
                resourceRule: {
                    resourceName: [
                        {
                            required: true,
                            type: 'string',
                            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                            message: '请输入资源名称且没有特殊符号',
                            trigger: 'blur'
                        }
                    ],
                    url: [
                        {required: true, type: 'string', pattern: /\S/, message: '请输入url路径且不为空', trigger: 'blur'}
                    ],
                    mustUrl: [
                        {required: false, trigger: 'blur'}
                    ],
                },

                searchInfo: false,
                adds: false,
                searchShow: false,
                flag: 0,
                searchWord: '',
                operation: {
                    edit: false,
                    del: false,
                    edit_del: false,
                },
                columns1: [
                    {
                        title: '租户名称',
                        key: 'tenantName'
                    },
                    {
                        title: '资源名称',
                        key: 'resourceName'
                    },
                    {
                        title: '资源编码',
                        key: 'resourceCode'
                    },
                    {
                        title: '是否为菜单',
                        key: 'isMenu',
                        render: (h, params) => {
                            return h('div', [
                                h('p', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                }, params.row.isMenu == 0 ? '否' : '是'),
                            ]);
                        }
                    },
                    {
                        title: '上级资源名称',
                        key: 'parentName'
                    },
                    {
                        title: 'url',
                        key: 'url'
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                    {
                        title: '更新时间',
                        key: 'modifyTime'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            // console.log(this.data1[params.index],11111);
                            return h('div', [

                                this.operation.edit || this.operation.edit_del ? h(Edit, {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        editData: this.BearingData,
                                        EditRule: this.resourceRule,
                                        check_list: this.res_List,
                                        apiInfo: api.res_update,
                                        apiInfoId: api.res_search,
                                        id: params.row.resourceId,
                                        index: params.index,
                                        page: this.page.pageIndex,
                                        resData:this.data1[params.index]
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }) : '',
                                this.operation.del || this.operation.edit_del ? h(Delete, {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        index: params.index,
                                        id: 'resourceId',
                                        dataInfo: this.data1,
                                        text: '资源',
                                        apiInfo: api.res_del,
                                        check_list: this.res_List
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index);
                                        }
                                    }
                                }, '删除') : ''
                            ]);
                        }
                    }
                ],
                data1: [],
                total: 0,
                page: {
                    pageIndex: 1,
                    pageSize: 10,
                },
                BearingData: [
                    {
                        prop: 'description',
                        model: 'description',
                        placeholder: '请输入描述',
                        label: '描述',
                        type: 'text'
                    }, {
                        prop: 'orderNo',
                        model: 'orderNo',
                        placeholder: '请输入排序号',
                        label: '排序号',
                        type: 'text'
                    }, {
                        prop: 'resourceName',
                        model: 'resourceName',
                        placeholder: '请输入资源名',
                        label: '资源名',
                        type: 'text'
                    },
                    {
                        prop: 'url',
                        model: 'url',
                        placeholder: '请输入url路径',
                        label: 'url路径',
                        show:"0",
                        type: 'text'
                    },
                    {
                        prop: 'mustUrl',
                        model: 'url',
                        placeholder: '请输入url路径',
                        label: 'url路径',
                        show:"1",
                        type: 'text'
                    },{
                        prop: 'isMenu',
                        model: 'isMenu',
                        placeholder: '',
                        label: '是否为菜单',
                        type: 'text',
                        html:"1"
                    },
                ],
                editItem:{}
            };
        },
        components: {
            Delete,
            Edit
        },
        created () {

            console.log(...this.BearingData.map(r => {
                return {
                    [r.prop]: ''
                };
            }));

            Cookies.remove('home_index');
            // Cookies.remove( 'res_index')
            Cookies.remove('role_index');
            Cookies.remove('user_index');

            this.$store.commit('resSearch');
            if (this.$store.state.app.resSearchFlag.length !== 0) {
                this.searchWord = this.$store.state.app.resSearchFlag;
                this.res_List();
            }
            util.jurisdiction(this, '查询资源列表', '新增资源', '修改资源', '删除资源');
            this.operation.edit || this.operation.edit_del || this.operation.del ? this.columns1.splice(this.columns1.length - 1, 0) : this.columns1.splice(this.columns1.length - 1, 1);

            if (Cookies.get('res_index')) {
                this.page.pageIndex = Number(Cookies.get('res_index'));
                Cookies.remove('res_index');
            }
            this.res_List();
        },
        methods: {
            searchChange () {
                this.page.pageIndex = 1;
                this.searchInfo = true;
                this.$store.commit('resSearch', this.searchWord);
                this.res_List();
            },
            //分页
            totol (index) {
                this.page.pageIndex = index;
                this.res_List();
            },
            res_add () {
                this.$router.push({name: 'addResources'});
            },
            //页面列表
            res_List (num) {
                if (num) {
                    this.page.pageIndex >= 1 ? this.page.pageIndex-- : this.page.pageIndex = 1;
                }
                this.SpinType = true;
                this.$axios({
                    method: 'post',
                    url: api.res_list(),
                    data: {
                        keyword: this.$store.state.app.resSearchFlag || '',
                        currentPage: this.page.pageIndex || 1,
                        pageSize: this.page.pageSize
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.SpinType = false;
                        if (res.data.data) {
                            this.data1 = res.data.data;
                            this.total = res.data.page.totalRecords;
                        } else {
                            this.data1 = [];
                            this.total = 0;
                        }
                        if (this.searchInfo) {
                            if (res.data.page) {
                                this.page.pageIndex = res.data.page.currentPage;
                            }
                            this.page.pageIndex = 1;
                        }
                        this.searchInfo = false;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
        },

    };
</script>
