<template>
    <div class="list_page">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="4">
            <h2 class="com_header">组织机构管理</h2>
            </Col>

            <Col class="operation">
            <Input size="large" v-model="searchWord" placeholder="请输入组织机构简称..." class="com_search"/>

            <Button type="primary" @click="searchChange">
                <Icon type="md-search" style=" font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="add_ops" v-if="adds">新增组织机构管理</Button>
            </Col>
        </Row>
        <Table border :columns="organizationTable" :data="organizationTableData" :loading='SpinType'
               class="com_table"></Table>
        <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging"
              @on-change="changepage"></Page>
    </div>
</template>
<style scoped>

</style>
<script>
    import api from '@/api';
    import util from '@/libs/util.js';
    import Cookies from 'js-cookie';
    import Delete from '../../common/delete/Delete.vue';
    import Edit from '../../common/edit/Edit.vue';

    export default {

        inject: ['reload'],
       data () {
            return {
                SpinType: false,//懒加载
                organizationRule: {
                    organizationCode: [
                        {required: true, message: '请输入组织机构编码且为数字', trigger: 'blur'}
                    ],
                    organizationName: [
                        {required: true, message: '请输入组织机构简称', trigger: 'blur'}
                    ],
                },//组织机构校验规则
                searchWord: '',//搜索词
                dataCount: 0,//当前总页数
                page: {
                    pageIndex: 1,
                    pageSize: 10
                },//当前页信息
                organizationTable: [
                    {
                        title: '租户名称',
                        key: 'tenantName'
                    },
                    {
                        title: '组织机构简称',
                        key: 'organizationName'
                    },
                    {
                        title: '组织机构全称',
                        key: 'fullName'
                    },
                    {
                        title: '组织机构编码',
                        key: 'organizationCode',
                    },
                    {
                        title: '上级机构名称',
                        key: 'parentName'
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
                            return h('div', [
                                this.operation.edit || this.operation.edit_del ? h(Edit, {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        editData:this.BearingData,
                                        EditRule:this.organizationRule,
                                        check_list: this.check_list,
                                        apiInfo:api.organizationUpdate,
                                        apiInfoId:api.organizationFindName,
                                        id:params.row.organizationId,
                                        index: params.index,
                                        page:this.page.pageIndex
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                }, '修改') : '',
                                this.operation.del || this.operation.edit_del ? h(Delete/*'Button'*/, {
                                    props: {
                                        index: params.index,
                                        type: 'error',
                                        size: 'small',
                                        dataInfo: this.organizationTableData,
                                        id: 'organizationId',
                                        text: '组织',
                                        apiInfo: api.organizationDel,
                                        check_list: this.check_list
                                    },
                                }, '删除') : '',
                            ]);
                        }
                    }
                ],
                organizationTableData: [],
                adds: false,//新增权限
                searchInfo: false,
                operation: {
                    edit: false,
                    del: false,
                    edit_del: false,
                },//权限校验的数据
                real: [],
                BearingData: [
                    {
                        prop: "description",
                        model: "description",
                        placeholder: '请输入描述',
                        label: '描述',
                        type: 'text'
                    },  {
                        prop: "fullName",
                        model: "fullName",
                        placeholder: '请输入组织机构全称',
                        label: '组织机构全称',
                        type: 'text'
                    },  {
                        prop: "organizationCode",
                        model: "organizationCode",
                        placeholder: '请输入组织机构编码',
                        label: '组织机构编码',
                        type: 'text'
                    },  {
                        prop: "organizationName",
                        model: "organizationName",
                        placeholder: '请输入组织机构简称',
                        label: '组织机构简称',
                        type: 'text'
                    },
                ]
            };
        },

        created () {
            //权限判断
            util.jurisdiction(this, '查询组织机构列表', '新增组织机构', '修改组织机构', '删除组织机构');
            this.operation.edit || this.operation.edit_del || this.operation.del ? this.organizationTable.splice(this.organizationTable.length - 1, 0) : this.organizationTable.splice(this.organizationTable.length - 1, 1);//判断table有没有"操作"这个文本

            Cookies.remove('res_index');
            Cookies.remove('role_index');
            Cookies.remove('user_index');
            this.$store.commit('orgSearch');
            if (this.$store.state.app.orgSearchFlag.length !== 0) {
                this.searchWord = this.$store.state.app.orgSearchFlag;
                this.check_list();
            }
            //数据改变不改变当前页数
            if (Cookies.get('home_index')) {
                this.page.pageIndex = Number(Cookies.get('home_index'));
                Cookies.remove('home_index');
            }
            this.check_list();
        },
        components: {
            Delete,
            Edit
        },
        methods: {
            //搜索
            searchChange () {
                this.page.pageIndex = 1;

                this.searchInfo = true;
                this.$store.commit('orgSearch', this.searchWord);
                this.check_list();
            },
            //分页
            changepage (index) {
                this.page.pageIndex = index;
                this.check_list();
            },
            //当前页列表数据
            check_list (num) {
                if (num) {
                    this.page.pageIndex >= 1 ? this.page.pageIndex-- : this.page.pageIndex = 1;
                }
                this.SpinType = true;
                this.$axios({
                    method: 'post',
                    url: api.organizationList(),
                    data: {
                        keyword: this.$store.state.app.orgSearchFlag || '',
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
                            this.organizationTableData = res.data.data;
                            this.dataCount = res.data.page.totalRecords;
                        } else {
                            this.organizationTableData = [];
                            this.dataCount = 0;
                        }
                        if (this.searchInfo) {
                            if (res.data.page) {
                                this.page.pageIndex = res.data.page.currentPage;
                            } else {
                                this.page.pageIndex = 1;
                            }
                        }
                        this.searchInfo = false;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            //新增
            add_ops () {
                this.$router.push({path: '/addOrganization', query: {data6: this.organizationTableData}});
            },
        }

    };
</script>





