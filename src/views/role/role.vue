<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="4">
            <h2 style="margin: 6px 0 0 20px">角色管理</h2>
            </Col>
            <Col style='text-align:right;margin-right:15px;width: 45%;'>
            <Input size="large" v-model="searchWord" placeholder="请输入搜索内容..." style="width: 35%;height: 34px;"/>
            <Button type="primary" @click='searchChange'>
                <Icon type="ios-search-strong" style="font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="add" v-if="addRole">新增角色</Button>
            </Col>
        </Row>
        <Table :columns="columns2" :data="data3" :loading='SpinType' style="margin: 5px 15px 0 15px;"></Table>
        <Page :total="allMuch" show-total :page-size="page.pageSize" :current="page.pageIndex" @on-change="totol"
              style="  float: right;margin-top: 10px; margin-right: 15px;"></Page>

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
            <div style="margin-left: 70%">
                <Button type="primary" @click="sure" style="margin-right: 20px;">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

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
                real: [],
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
                addResource: false,
                addRole: false,
                searchShow: false,
                flag: 0,
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
                        width: '300px',
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
                                                this.edit(params.index);
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
                                                                        this.$Message.info('已删除');
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
            if(JSON.parse(localStorage.getItem('Jurisdiction'))){
                JSON.parse(localStorage.getItem('Jurisdiction')).forEach(r => {
                    r.child && r.child.forEach(r => {
                        if (r.resourceName == '查询角色列表') {
                            this.searchShow = true;
                        } else if (r.resourceName == '新增角色') {
                            this.addRole = true;
                        } else if (r.resourceName == '修改角色') {
                            this.operation.edit = true;
                            this.flag = 1;
                        } else if (r.resourceName == '删除角色') {
                            if (this.flag === 1) {
                                this.operation.edit_del = true;
                                this.flag = 2;
                            } else {
                                this.del = true;
                                this.flag = 3;
                            }

                        } else if (r.resourceName == '绑定资源') {
                            if (this.flag === 2) {
                                this.operation.edit_del_binding = true;
                            } else if (this.flag === 0) {
                                this.operation.binding = true;
                            } else if (this.flag === 3) {
                                this.operation.del_binding = true;
                            } else if (this.flag === 1) {
                                this.operation.edit_binding = true;
                            }
                        }
                    });
                    // if (typeof r.resourceCode === 'string') {
                    //     if (r.resourceCode.split('/')[1] == 'role') {

                    //     }
                    // }

                });
            }else{
                this.$Message.error("无法检测到你的权限")
                this.$store.commit('logout', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$router.push({
                    name: 'login'
                });
            }

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
                                let replace_data = this.data3[Cookies.get('role_num')];
                                let date = new Date();
                                replace_data.description = this.formItem.description;
                                replace_data.orderNo = this.formItem.orderNo;
                                replace_data.roleName = this.formItem.roleName;
                                // replace_data.modifyTime = `${date.getFullYear()}` + `-${date.getMonth() + 1}` +`-${date.getDate()<10?'0':""}${date.getDate().length===1?'0'+date.getDate():date.getDate()}`
                                this.role_List();
                                // this.reload()
                            }
                        });
                        this.modal2 = false;
                        this.$Message.info('已修改');
                    }
                });

            },
            //取消修改
            cancel () {
                //
                // let a = this.data3.map(r => {
                //     if (r.userId === this.real.userId) {
                //         r:Object.assign({}, ...this.real);
                //     }
                // });
                this.$refs.formItem.resetFields();
                this.modal2 = false;
                /*this.$refs.formInline.resetFields();*/
                /* this.formItem={
                     description: '',
                     orderNo: '',
                     roleName: '',
                 }*/
                this.$Message.info('已取消');
            },
            //编辑
            edit (num) {
                this.formItem = JSON.parse(JSON.stringify(this.data3[num]));
                this.real = JSON.parse(JSON.stringify(this.data3[num]));
                this.modal2 = true;
                Cookies.set('role_num', num);
                Cookies.set('role_index', this.page.pageIndex);
            }
        }
    };
</script>
<style>
    * {
        margin: 0;
        padding: 0;

    }

    .tissue_header h2 {
        line-height: 50px;
        padding-left: 5px;
    }

    /* 角色授权
      */
    .role_header ul li {
        width: 150px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #e7e7ee;
        float: left;
    }
</style>


