<template>
    <div class="list_page">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="4">
            <h2 class="com_header">角色管理</h2>
            </Col>
            <Col class="operation">
            <Input size="large" v-model="searchWord" placeholder="请输入搜索内容..." class="com_search"/>
            <Button type="primary" @click='searchChange'>
                <Icon type="md-search" style="font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="add" v-if="adds">新增角色</Button>
            </Col>
        </Row>

        <Table border :columns="columns2" :data="data3" :loading='SpinType' class="com_table"></Table>

        <Page :total="allMuch" show-total :page-size="page.pageSize" :current="page.pageIndex" @on-change="totol"
              class="paging"></Page>
     

    </div>
</template>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import Delete from '../../common/delete/Delete.vue';
    import Edit from '../../common/edit/Edit.vue';

    export default {
        inject: ['reload'],
        name: 'home',
        data () {
            return {
                ruleInline: {
                    roleName: [
                        {required: true, type: 'string', pattern: /\S/, message: '请输入正确的角色名且不能包含空格', trigger: 'blur'},
                    ],
                },
                SpinType: false,
                operation: {
                    edit: false,
                    del: false,
                    binding: false,
                    edit_del: false,
                    edit_binding: false,
                    del_binding: false,
                    edit_del_binding: false
                },
                searchInfo: false,
                adds: false,
                searchWord: '',
                allMuch: 0,
                page: {
                    pageIndex: 1,
                    pageSize: 10,
                },
                data3: [],
                columns2: [
                    {
                        title: '租户名称',
                        key: 'tenantName',
                    },
                    {
                        title: '角色名称',
                        key: 'roleName',
                    },
                    {
                        title: '描述',
                        key: 'description',
                    },
                    {
                        title: '更新时间',
                        key: 'modifyTime',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 300,
                        render: (h, params) => {
                            return h('div', [
                                this.operation.edit || this.operation.edit_del || this.operation.edit_binding || this.operation.edit_del_binding ? h( Edit, {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            editData:this.BearingData,
                                            EditRule:this.ruleInline,
                                            check_list: this.role_List,
                                            apiInfo:api.role_update,
                                            apiInfoId:api.role_roleId,
                                            id:params.row.roleId,
                                            index: params.index,
                                            page:this.page.pageIndex
                                        },
                                        style: {
                                            marginRight: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.edit(params.index, params.row.roleId);
                                            }
                                        }
                                    }) : '',
                                this.operation.del || this.operation.edit_del || this.operation.del_binding || this.operation.edit_del_binding ? h(
                                    Delete,
                                    {
                                        props: {
                                            index: params.index,
                                            type: 'error',
                                            size: 'small',
                                            dataInfo: this.data3,
                                            id:"roleId",
                                            text:"角色",
                                            apiInfo: api.role_del,
                                            check_list: this.role_List
                                        },
                                        style: {
                                            color: 'white',
                                            marginRight: '10px'
                                        },

                                    }, '删除'
                                ) : '',
                                this.operation.binding || this.operation.edit_binding || this.operation.del_binding || this.operation.edit_del_binding ? h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'success',
                                            size: 'small',
                                        },
                                        style: {
                                            color: 'white'
                                        },
                                        on: {
                                            click: () => {
                                                if (this.searchWord) {
                                                    this.$store.commit('bindingChangeRes', this.searchWord);
                                                }
                                                Cookies.set('role_index', this.page.pageIndex);
                                                Cookies.set('role_search', this.searchWord);
                                                this.$router.push({
                                                    name: 'access_bang',
                                                    query: {
                                                        id: JSON.stringify(this.data3[params.index].roleId),
                                                        pageIndex: JSON.stringify(this.page.pageIndex)
                                                    }
                                                });
                                            }
                                        }
                                    }, '绑定资源'
                                ) : ''
                            ]);
                        }
                    }
                ],
                isClickSearch: false,
                BearingData: [
                    {
                        prop: "description",
                        model: "description",
                        placeholder: '请输入描述',
                        label: '描述',
                        type: 'text'
                    },  {
                        prop: "orderNo",
                        model: "orderNo",
                        placeholder: '请输入排列顺序',
                        label: '排列号',
                        type: 'text'
                    },  {
                        prop: "roleName",
                        model: "roleName",
                        placeholder: '请输入角色名',
                        label: '角色名',
                        type: 'text'
                    },
                ]
            };
        },
        created () {
            Cookies.remove('home_index');
            Cookies.remove('res_index');
            // Cookies.remove( 'role_index')
            Cookies.remove('user_index');

            this.$store.commit('bindingChangeRes');
            if (this.$store.state.app.binding.length !== 0) {
                this.searchWord = this.$store.state.app.bindingRes;
                // this.role_List()
            }

            util.jurisdiction(this, '查询角色列表', '新增角色', '修改角色', '删除角色', '绑定资源');
                this.operation.edit || this.operation.edit_del || this.operation.del || this.edit_del_binding ?this.columns2.splice(this.columns2.length - 1, 0): this.columns2.splice(this.columns2.length - 1, 1);


            if (Cookies.get('role_index')) {
                this.page.pageIndex = Number(Cookies.get('role_index'));
                Cookies.remove('role_index');
            }
            this.role_List();
        },
        methods: {
            searchChange () {
                this.page.pageIndex = 1;
                this.searchInfo = true;
                this.$store.commit('bindingChangeRes', this.searchWord);
                this.isClickSearch = true;
                this.role_List();
            },
            totol (index) {
                this.page.pageIndex = index;
                if (this.searchWord.length == 0) {
                    this.searchInfo = false;
                }
                this.role_List();
            },
            add () {
                this.$router.push({name: 'access_adds'});
            },
            role_List (num) {
                if (num) {
                    this.page.pageIndex >=1? this.page.pageIndex--: this.page.pageIndex= 1
                }
                if (Cookies.get('role_search')) {
                    this.$store.commit('bindingChangeRes', Cookies.get('role_search'));
                    this.searchWord = Cookies.get('role_search');
                    Cookies.remove('role_search');
                }
                this.SpinType = true;
                this.$axios({
                    method: 'post',
                    url: api.role_list(),
                    data: {
                        keyword: this.$store.state.app.bindingRes || '',
                        currentPage:  this.page.pageIndex||1,
                        pageSize: this.page.pageSize
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {

                    if (res.data.code == 200) {
                        this.SpinType = false;
                        if (res.data.data) {
                            this.data3 = res.data.data;
                            this.allMuch = res.data.page.totalRecords;
                        } else {
                                this.allMuch = 0;
                                this.data3 = [];
                        }if (this.searchInfo) {
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
        }
    };
</script>
<style>

</style>


