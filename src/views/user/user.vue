<template>
    <div class="list_page">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="4">
            <h2 class="com_header">用户管理</h2>
            </Col>



            <Col class="operation">
            <Input size="large" v-model="searchWord" placeholder="请输入昵称/手机号/邮箱/员工编号" class="user_search"/>


            <Button type="primary" @click='searchChange'>
                <Icon type="md-search" style="font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="add_access" v-if="adds">新增用户</Button>
            <Button type="primary" @click="lost" v-if="loseList">失败列表</Button>
            </Col>
        </Row>
        <Table border :columns="historyColumns" :data="historyData" :loading='SpinType'
               class="com_table"></Table>
        <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging"
              @on-change="changepage"></Page>

    </div>
</template>
<style scoped>
    .paging {
        float: right;
        margin-top: 10px;
        margin-right: 15px;
    }
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
                searchWord: '',
                modal2: false,
                // 初始化信息总条数
                dataCount: 0,
                // 每页显示多少条
                page: {
                    pageIndex: 1,
                    pageSize: 10
                },
                historyColumns: [
                    {
                        title: '昵称',
                        key: 'nickname'
                    }, {
                        title: '手机号',
                        key: 'mobile'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    }, {
                        title: '员工编号',
                        key: 'employeeCode'
                    },
                    {
                        title: '组织机构名称',
                        key: 'organizationName'
                    },
                    {
                        align: 'center',
                        title: '操作',
                        width: 300,
                        key: 'deletetStatus',
                        render: (h, params) => {
                            return h('div', [
                                this.operation.edit || this.operation.edit_del || this.operation.edit_binding || this.operation.edit_del_binding ? h(Edit, {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        editData: this.BearingData,
                                        check_list: this.user_List,
                                        apiInfo: api.userUpdate,
                                        apiInfoId: api.userUserId,
                                        id: params.row.userId,
                                        index: params.index,
                                        page: this.page.pageIndex,
                                        user: 'user'
                                    },
                                    style: {
                                        marginRight: '2%'
                                    }
                                }) : '',
                                this.operation.del || this.operation.edit_del || this.operation.del_binding || this.operation.edit_del_binding ? h(Delete, {
                                    props: {
                                        index: params.index,
                                        type: 'error',
                                        size: 'small',
                                        dataInfo: this.historyData,
                                        id: 'userId',
                                        text: '用户',
                                        apiInfo: api.userDelete,
                                        check_list: this.user_List
                                    },
                                }, '删除') : '',
                                this.operation.binding || this.operation.edit_binding || this.operation.del_binding || this.operation.edit_del_binding ? h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '2%'
                                    },
                                    on: {
                                        click: () => {
                                            if (this.searchWord) {
                                                this.$store.commit('bindingChange', this.searchWord);
                                            }
                                            Cookies.set('user_search', this.searchWord);
                                            Cookies.set('user_index', this.page.pageIndex);
                                            this.$router.push({
                                                name: 'bang_access',
                                                query: {data: JSON.stringify(this.historyData[params.index].userId)}
                                            });
                                        }
                                    }
                                }, '绑定角色') : '',
                            ]);
                        }
                    }
                ],
                historyData: [],
                adds: false,
                formItem: {
                    email: '',
                    mobile: '',
                    nickname: '',
                    organizationId: '',
                },
                loseList: false,
                searchInfo: false,
                operation: {
                    edit: false,
                    del: false,
                    binding: false,
                    edit_del: false,
                    edit_binding: false,
                    del_binding: false,
                    edit_del_binding: false
                },
                BearingData: [
                    {
                        prop: 'email',
                        label: '邮箱',
                        model: 'email',
                        text: '1',
                        html: '0'
                    }, {
                        prop: 'mobile',
                        label: '手机号',
                        model: 'mobile',
                        text: '1',
                        html: '0'
                    }, {
                        prop: 'nickname',
                        model: 'nickname',
                        placeholder: '请输入昵称',
                        label: '昵称',
                        type: 'text'
                    },
                ],
            };
        },
        created () {
            Cookies.remove('home_index');
            Cookies.remove('res_index');
            Cookies.remove('role_index');
            // Cookies.remove( 'user_index')
            this.$store.commit('bindingChange');
            if (this.$store.state.app.binding.length !== 0) {
                this.searchWord = this.$store.state.app.binding;
                this.user_List();
            }
            util.jurisdiction(this, '查询用户列表',  '新增用户', '修改用户', '删除用户','绑定角色','查询监听失败列表',);

            this.operation.edit || this.operation.edit_del || this.operation.del || this.edit_del_binding ? this.historyColumns.splice(this.historyColumns.length - 1, 0) : this.historyColumns.splice(this.historyColumns.length - 1, 1);


            if (Cookies.get('user_index')) {
                this.page.pageIndex = Number(Cookies.get('user_index'));
                Cookies.remove('user_index');
            }
            this.user_List();
        },
        methods: {
            searchChange () {
                this.$store.commit('bindingChange', this.searchWord);
                this.searchInfo = true;
                this.user_List();
            },
            lost () {
                this.$router.push({name: 'lost_list'});
            },
            add_access () {
                this.$router.push({
                    name: 'access_add',
                });

            },
            //用户管理列表
            user_List (num) {
                if (num) {
                    num ? this.page.pageIndex = 1 : --this.page.pageIndex;
                }
                this.SpinType = true;
                if (Cookies.get('user_index')) {
                    this.page.pageIndex = Cookies.get('user_index');
                }
                if (Cookies.get('user_search')) {
                    this.$store.commit('bindingChange', Cookies.get('user_search'));
                    this.searchWord = Cookies.get('user_search');
                    Cookies.remove('user_search');
                }

                this.$axios({
                    method: 'post',
                    url: api.userList(),
                    data: {
                        keyword: this.$store.state.app.binding ||"",
                        currentPage: this.page.pageIndex || 1,
                        pageSize: this.page.pageSize
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.SpinType = false;
                        if (res.data.data) {
                            this.historyData = res.data.data;
                            this.dataCount = res.data.page.totalRecords;
                        } else {
                            this.dataCount = 0;
                            this.historyData = [];
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
            changepage (index) {
                this.page.pageIndex = index;
                this.user_List();
            },


        }
    };
</script>
<style>
    .user_search {
        width: 35%;
        height: 34px;
    }
</style>
