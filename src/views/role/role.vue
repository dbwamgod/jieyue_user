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

        <Modal
                v-model="modal2"
                title="修改信息"
                :footer-hide='true'
                :closable="false"
                :mask-closable="false"
        >
            <Form ref="formItem" :model="formItem" :rules="ruleInline">
                <FormItem label="描述" prop="description">
                    <Input v-model="formItem.description" placeholder="描述"></Input>
                </FormItem>
                <FormItem label="排序号" prop="orderNo">
                    <Input v-model="formItem.orderNo" placeholder="排列顺序"></Input>
                </FormItem>
                <FormItem label="角色名称" prop="roleName">
                    <Input v-model="formItem.roleName" placeholder="角色名称"></Input>
                </FormItem>
            </Form>
            <div class="sure-cancel">
                <Button type="primary" @click="sure" class="sure_edit">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';

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
                modal2: false,
                formItem: {
                    description: '',
                    orderNo: '',
                    roleName: '',
                },
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
                formRight: {
                    description: '',
                    orderNo: '',
                    roleId: '',
                    roleName: '',
                    userId: ''
                },
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
                                this.operation.edit || this.operation.edit_del || this.operation.edit_binding || this.operation.edit_del_binding ? h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                        },
                                        style: {
                                            marginRight: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.edit(params.index, params.row.roleId);
                                            }
                                        }
                                    }, '编辑'
                                ) : '',
                                this.operation.del || this.operation.edit_del || this.operation.del_binding || this.operation.edit_del_binding ? h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                        },
                                        style: {
                                            color: 'white',
                                            marginRight: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.$Modal.confirm({
                                                    title: '删除警告',
                                                    content: '<p>您确定要删除该角色吗</p>',
                                                    loading: true,
                                                    onOk: () => {
                                                        setTimeout(() => {
                                                            Cookies.set('del', this.page.pageIndex);

                                                            this.$axios({
                                                                method: 'post',
                                                                url: api.role_del(),
                                                                data: {
                                                                    roleId: this.data3[params.index].roleId,
                                                                    userId: Cookies.get('user_userId')
                                                                },
                                                                headers: {
                                                                    Authorization: Cookies.get('token'),
                                                                    'Content-Type': 'application/json;charset=UTF-8'
                                                                }
                                                            }).then(res => {
                                                                if (res.data.code == 200) {
                                                                    if (this.data3.length < 2) {
                                                                        this.$axios({
                                                                            method: 'post',
                                                                            url: api.role_list(),
                                                                            data: {
                                                                                keyword: this.searchWord,
                                                                                currentPage: this.page.pageIndex ? 1 : --this.page.pageIndex,
                                                                                pageSize: this.page.pageSize
                                                                            },
                                                                            headers: {
                                                                                'Content-Type': 'application/json;charset=UTF-8'
                                                                            }
                                                                        }).then(res => {
                                                                            if (res.data.code == 200) {
                                                                                if (this.page.pageIndex > 1) {
                                                                                    --this.page.pageIndex;
                                                                                }
                                                                                if (res.data.data) {
                                                                                    this.data3 = res.data.data;
                                                                                    this.allMuch = res.data.page.totalRecords;
                                                                                } else {
                                                                                    this.allMuch = 0;
                                                                                    this.data3 = [];
                                                                                }
                                                                            } else {
                                                                                this.$Message.info(res.data.msg);
                                                                                this.$Modal.remove();
                                                                            }
                                                                        });
                                                                    } else {
                                                                        this.role_List();
                                                                        this.searchInfo = true;
                                                                    }
                                                                    this.$Modal.remove();
                                                                } else {
                                                                    this.$Modal.remove();
                                                                    this.$Message.info(res.data.msg);
                                                                }

                                                            });
                                                        }, 0);
                                                    }
                                                });

                                            }
                                        }
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
                isClickSearch: false
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
            role_List (arg) {
                if (this.searchWord.length >= 1) {
                    this.isClickSearch = false;
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
                        currentPage: this.searchInfo && this.isClickSearch ? 1 : this.page.pageIndex,
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
                            if (this.searchInfo) {
                                this.allMuch = 0;
                                this.data3 = [];
                            } else {
                                --this.page.pageIndex;
                                this.role_List();
                            }
                        }

                        this.searchInfo = false;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },

            //确定修改
            sure () {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        this.$axios({
                            method: 'post',
                            url: api.role_update(),
                            data: {
                                description: this.formItem.description,
                                orderNo: this.formItem.orderNo,
                                roleId: this.formItem.roleId,
                                roleName: this.formItem.roleName,
                                userId: Cookies.get('user_userId')
                            },
                            headers: {
                                Authorization: Cookies.get('token'),
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            if (res.data.code === 200) {
                                this.role_List();
                                this.$Message.info('已修改');
                                this.modal2 = false;
                            } else if (res.data.code === 500) {
                                this.$Message.error(res.data.msg);
                            }
                        });

                    }
                });

            },
            //取消修改
            cancel () {
                this.$refs.formItem.resetFields();
                this.modal2 = false;
            },
            //编辑
            edit (num, i) {

                this.$axios({
                    method: 'get',
                    url: api.role_roleId(i),
                }).then(r => {
                    if (r.data.code == 200) {

                        this.formItem = JSON.parse(JSON.stringify(r.data.data));

                        this.modal2 = true;
                        Cookies.set('role_num', num);
                        Cookies.set('role_index', this.page.pageIndex);

                    }
                });

            }
        }
    };
</script>
<style>

</style>


