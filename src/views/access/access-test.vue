<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="4">
            <h2 style="margin: 6px 0 0 20px">用户管理</h2>
            </Col>

            <Col style='width: 80%;text-align:right;margin-right:15px;'>
            <Input size="large" v-model="searchWord" placeholder="请输入搜索内容..." style="width: 17%;height: 34px;"/>
            <Button type="primary" @click='searchChange'>
                <Icon type="ios-search-strong" style="font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="add_access" v-if="addUser">新增用户</Button>
            <Button type="primary" @click="lost" v-if="loseList">失败列表</Button>
            </Col>
        </Row>
        <Table :columns="historyColumns" :data="historyData" :loading='SpinType'
               style="margin: 5px 15px 0 15px;"></Table>
        <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging"
              @on-change="changepage"></Page>

        <Modal
                v-model="modal2"
                title="修改信息"
                @on-ok="okone"
                @on-cancel="canceloneone">

            <Form ref="formItem" :model="formItem">
                <FormItem prop="email">
                    <p>邮箱</p>
                    {{this.formItem.email}}
                    <!--<Input type="text" v-model="formItem.email" placeholder="email">-->
                    </Input>
                </FormItem>
                <FormItem prop="mobile">
                    <p>手机号</p>
                    {{this.formItem.mobile}}
                    <!--<Input type="text" v-model="formItem.mobile" placeholder="mobile">-->
                    </Input>
                </FormItem>
                <FormItem prop="nickname">
                    <p>昵称</p>
                    <Input type="text" v-model="formItem.nickname" placeholder="昵称">
                    </Input>
                </FormItem>
                <!--  <FormItem prop="organizationId">
                      <p>组织机构id</p>
                      <Input type="text" v-model="formItem.organizationId" placeholder="organizationId">
                      </Input>
                  </FormItem>-->
            </Form>
        </Modal>
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

    export default {
        inject: ['reload'],
        data () {
            return {
                SpinType: false,

                addResource: false,
                searchShow: false,
                flag: 0,
                searchWord: '',
                real: [],
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
                        width: '300px',
                        key: 'deletetStatus',
                        render: (h, params) => {
                            return h('div', [
                                this.operation.edit || this.operation.edit_del || this.operation.edit_binding || this.operation.edit_del_binding ? h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '2%'
                                    },
                                    on: {
                                        click: () => {

                                            this.formItem = JSON.parse(JSON.stringify(this.historyData[params.index]));
                                            this.real = JSON.parse(JSON.stringify(this.historyData[params.index]));
                                            this.modal2 = true;
                                            Cookies.set('user_num', params.index);
                                        }
                                    }
                                }, '修改') : '',
                                this.operation.del || this.operation.edit_del || this.operation.del_binding || this.operation.edit_del_binding ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },

                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除警告',
                                                content: '<p>您确定要删除该用户吗</p>',
                                                loading: true,
                                                onOk: () => {
                                                    setTimeout(() => {
                                                        this.user_Delete(this.historyData[params.index].userId, params.index);
                                                    }, 0);
                                                }
                                            });
                                        }
                                    }
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
                                            Cookies.set('user_search',this.searchWord);
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
                addUser: false,
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
                space: {}
            };
        },
        created () {
            Cookies.remove( 'home_index')
            Cookies.remove( 'res_index')
            Cookies.remove( 'role_index')
            // Cookies.remove( 'user_index')
            this.$store.commit('bindingChange');
            if (this.$store.state.app.binding.length !== 0) {
                this.searchWord = this.$store.state.app.binding;
                this.user_List();
            }
            if( JSON.parse(localStorage.getItem('Jurisdiction'))){
                JSON.parse(localStorage.getItem('Jurisdiction')).forEach(r => {
                    r.child &&  r.child.forEach(r => {
                        if (r.resourceName == '查询用户列表') {
                            this.searchShow = true;
                        } else if (r.resourceName == '查询监听失败列表') {
                            this.loseList = true;
                        } else if (r.resourceName == '新增用户') {
                            this.addUser = true;
                        } else if (r.resourceName == '修改用户') {
                            this.operation.edit = true;
                            this.flag = 1;
                        } else if (r.resourceName == '删除用户') {
                            if (this.flag === 1) {
                                this.operation.edit_del = true;
                                this.flag = 2;
                            } else {
                                this.del = true;
                                this.flag = 3;
                            }
                        } else if (r.resourceName == '绑定角色') {
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
                });
            }else{
                this.$Message.error("无法检测到你的权限")
                this.$store.commit('logout', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$router.push({
                    name: 'login'
                });
            }
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
            //用户管理
            user_List () {
                this.SpinType = true;

                if (Cookies.get('user_index')) {
                    this.page.pageIndex = Cookies.get('user_index');
                }
                if(Cookies.get("user_search")){
                    this.$store.commit("bindingChange",Cookies.get("user_search"))
                    this.searchWord=Cookies.get("user_search")
                    Cookies.remove("user_search")
                }

                this.$axios({
                    method: 'post',
                    url: api.userList(),
                    data: {
                        keyword: this.$store.state.app.binding || '',
                        currentPage: this.searchInfo ? 1 : this.page.pageIndex,
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
                            if (this.searchInfo) {
                                this.dataCount = 0;
                                this.historyData = [];
                            } else {
                                --this.page.pageIndex;
                                this.user_List();
                            }

                        }
                        if (this.searchInfo) {
                            this.page.pageIndex = 1;
                        }
                        this.searchInfo = false;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });

            },
            user_Delete (userId, index) {
                this.$axios({
                    method: 'post',
                    url: api.userDelete(),
                    data: {
                        userId: userId
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {

                        if (this.historyData.length < 2) {
                            this.$axios({
                                method: 'post',
                                url: api.userList(),
                                data: {
                                    keyword: this.searchWord,
                                    currentPage: 1,
                                    pageSize: this.page.pageSize
                                },
                                headers: {
                                    'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }).then(res => {
                                if (res.data.code == 200) {
                                    if (res.data.data) {
                                        this.historyData = res.data.data;
                                        this.dataCount = res.data.page.totalRecords;
                                    } else {
                                        this.dataCount = 0;
                                        this.historyData = [];
                                    }
                                } else {
                                    this.$Message.info(res.data.msg);
                                }
                            });
                        } else {
                            this.$Message.info('已删除');
                            this.searchInfo = true;
                            this.user_List();
                        }
                        this.$Modal.remove();
                    }
                    else {
                        this.$Modal.remove();
                        this.$Message.info(res.data.msg);
                    }

                });

            },
            user_Update () {
                this.$axios({
                    method: 'post',
                    url: api.userUpdate(),
                    data: {
                        email: this.formItem.email,
                        employeeCode: this.formItem.employeeCode,
                        mobile: this.formItem.mobile,
                        nickname: this.formItem.nickname,
                        orderNo: this.formItem.orderNo,
                        userId: this.formItem.userId
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.historyData[Cookies.get('user_num')].nickname = this.formItem.nickname;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });

            },
            changepage (index) {
                this.page.pageIndex = index;
                this.user_List();
            },
            okone () {

                this.user_Update();
                this.$Message.info('已修改');
            },
            canceloneone () {
                let a = this.historyData.map(r => {
                    if (r.userId === this.real.userId) {
                        r:Object.assign({}, ...this.real);
                    }
                });
                this.$refs.formItem.resetFields();

                this.modal2 = false;
                this.$Message.info('已取消');
            },
            remove (index) {
                this.historyData.splice(index, 1);
            }
        }
    };
</script>
<style>
    .aa {
    }
</style>