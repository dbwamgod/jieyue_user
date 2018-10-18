<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="4">
            <h2 style="margin: 6px 0 0 20px">资源接口</h2>
            </Col>
            <Col span="2" style='text-align:right;margin-right:15px;width: 35%;'>
            <Input size="large" v-model="searchWord" placeholder="请输入搜索内容..." style="width: 35%;height: 34px;"/>
            <Button type="primary" @click="searchChange">
                <Icon type="ios-search-strong" style="font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="res_add" v-if="addResource">新增资源</Button>
            </Col>
        </Row>
        <Table :columns="columns1" :data="data1" id="table1" :loading='SpinType'
               style="margin: 5px 15px 0 15px;"></Table>
        <Page class="paging" :total="total" :page-size="page.pageSize" :current="page.pageIndex" @on-change="totol"
              show-total/>
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
                <FormItem label="资源名" prop="resourceName">
                    <Input v-model="formItem.resourceName" placeholder="资源名称"></Input>
                </FormItem>
                <FormItem label="url路径" prop="url" v-show="!isShow">
                    <Input v-model="formItem.url"></Input>
                </FormItem>
                <FormItem label="url路径" prop="mustUrl" v-show="isShow">
                    <Input v-model="formItem.url"></Input>
                </FormItem>
                <FormItem label="是否为菜单" prop="isMenu">
                    <RadioGroup v-model="formItem.isMenu">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <div style="margin-left: 70%">
                <Button type="primary" @click="sure" style="margin-right: 20px;">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
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
                ruleInline: {
                    resourceName: [
                        {
                            required: true,
                            type: 'string',
                            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                            message: '请输入资源名称并不能为空',
                            trigger: 'blur'
                        }
                    ],
                    url: [
                        {required: true, message: '请输入url路径', trigger: 'blur'}
                    ],
                    mustUrl: [
                        {required: false, trigger: 'blur'}
                    ],
                },
                formItem: {
                    description: '',
                    orderNo: 100,
                    resourceName: '',
                    resourceId: [],
                    url: '',
                    mustUrl: '',
                    isMenu: ''
                },
                searchInfo: false,
                addResource: false,
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
                                this.operation.edit || this.operation.edit_del ? h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.index);
                                        }
                                    }
                                }, '修改') : '',
                                this.operation.del || this.operation.edit_del ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
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

                modal2: false,
                real: [],
                isShow: false
            };
        },
        created () {
            Cookies.remove('home_index');
            // Cookies.remove( 'res_index')
            Cookies.remove('role_index');
            Cookies.remove('user_index');

            this.$store.commit('resSearch');
            if (this.$store.state.app.resSearchFlag.length !== 0) {
                this.searchWord = this.$store.state.app.resSearchFlag;
                this.res_List();
            }
            if (JSON.parse(localStorage.getItem('Jurisdiction'))) {
                JSON.parse(localStorage.getItem('Jurisdiction')).forEach(r => {
                   r.child && r.child.forEach(r => {
                        if (r.resourceName == '查询资源列表') {
                            this.searchShow = true;
                        } else if (r.resourceName == '新增资源') {
                            this.addResource = true;
                        } else if (r.resourceName == '修改资源') {
                            this.operation.edit = true;
                            this.flag = 1;
                        } else if (r.resourceName == '删除资源') {
                            if (this.flag === 1) {
                                this.operation.edit_del = true;
                            } else {
                                this.operation.del = true;
                            }
                        }
                    });

                });
            } else {
                this.$Message.error('无法检测到你的权限');
                this.$store.commit('logout', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$router.push({
                    name: 'login'
                });
            }
            if (!(this.operation.edit || this.operation.del)) {
                this.columns1.splice(this.columns1.length - 1, 1);
            }
            if (Cookies.get('res_index')) {
                this.page.pageIndex = Number(Cookies.get('res_index'));
                Cookies.remove('res_index');
            }
            this.res_List();
            this.formItem.url == 0 ? this.isShow = false : this.isShow = true;
        },
        watch: {
            'formItem.isMenu' (to, form) {
                if (to == 1) {
                    this.isShow = true;
                    this.ruleInline.url = [];
                } else {
                    this.isShow = false;
                    this.ruleInline.url = [{required: true, message: '请输入url路径', trigger: 'blur'}];
                }
            }
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
            res_List () {
                this.SpinType = true;
                this.$axios({
                    method: 'post',
                    url: api.res_list(),
                    data: {
                        keyword: this.$store.state.app.resSearchFlag || '',
                        currentPage: this.searchInfo ? 1 : this.page.pageIndex || 1,
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

                            if (this.searchInfo) {
                                this.data1 = [];
                                this.total = 0;
                            } else {
                                --this.page.pageIndex;
                                this.res_List();
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
            //删除
            remove (index) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>您确定要删除该资源吗</p>',
                    loading: true,
                    onOk: () => {
                        setTimeout(() => {
                            Cookies.set('del', this.page.pageIndex);
                            this.$axios({
                                method: 'post',
                                url: api.res_del(),
                                data: {
                                    resourceId: this.data1[index].resourceId,
                                    userId: Cookies.get('userId')
                                },
                                headers: {
                                    Authorization: Cookies.get('token'),
                                    'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }).then(res => {
                                if (res.data.code == 200) {
                                    if (this.data1.length < 2) {
                                        this.$axios({
                                            method: 'post',
                                            url: api.res_list(),
                                            data: {
                                                keyword: this.searchWord,
                                                currentPage: 1,
                                                pageSize: this.page.pageSize
                                            },
                                            headers: {
                                                Authorization: Cookies.get('token'),
                                                'Content-Type': 'application/json;charset=UTF-8'
                                            }
                                        }).then(res => {
                                            if (res.data.code == 200) {
                                                if (res.data.data) {
                                                    this.data1 = res.data.data;
                                                    this.total = res.data.page.totalRecords;
                                                } else {
                                                    this.data1 = [];
                                                    this.total = 0;
                                                }
                                            } else {
                                                this.$Message.info(res.data.msg);
                                            }
                                        });
                                    } else {
                                        this.$Message.info('已删除');
                                        this.searchInfo = true;
                                        this.res_List();
                                    }
                                    // this.role_List(Cookies.get('del'))
                                } else {
                                    this.$Message.info(res.data.msg);
                                }
                                this.$Modal.remove();
                            });
                        }, 0);
                    }
                });
            },
            //确定修改
            sure () {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        this.$axios({
                            method: 'post',
                            url: api.res_update(),
                            data: {
                                description: this.formItem.description || '无',
                                orderNo: this.formItem.orderNo || 100,
                                resourceId: this.formItem.resourceId,
                                isMenu: this.formItem.isMenu,
                                resourceName: this.formItem.resourceName,
                                url: Number(this.formItem.isMenu) ? this.formItem.url || '' : this.formItem.url,
                                userId: Cookies.get('userId'),
                                parentId: this.formItem.parentId
                            },
                            headers: {
                                Authorization: Cookies.get('token'),
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            if (res.data.code === 200) {
                                let replace_data = this.data1[Cookies.get('res_num')];
                                let date = new Date();
                                replace_data.description = this.formItem.description;
                                replace_data.orderNo = this.formItem.orderNo;
                                replace_data.resourceName = this.formItem.resourceName;
                                replace_data.url = /*this.formItem.isMenu?'':*/this.formItem.url;
                                replace_data.isMenu = this.formItem.isMenu;
                                //
                                // replace_data.modifyTime = `${date.getFullYear()}` + `-${date.getMonth() + 1}` +`-${date.getDate()<10?'0':""}${date.getDate().length===1?'0'+date.getDate():date.getDate()}`
                                // console.log(replace_data);
                                this.reload();
                            } else {
                                this.$Message.info(res.data.msg);
                            }
                        });
                        this.$Message.info('已修改');
                        this.modal2 = false;
                    } else {
                        // this.$Message.error('资源名不能为空且不能包含空格!');
                    }
                });
            },
            //取消修改
            cancel () {
                let a = this.data1.map(r => {
                    if (r.userId === this.real.userId) {
                        r:Object.assign({}, ...this.real);
                    }
                });
                this.$refs.formItem.resetFields();

                this.modal2 = false;
                this.$Message.info('已取消');
            },
            //编辑
            edit (num) {
                this.formItem = JSON.parse(JSON.stringify(this.data1[num]));
                this.real = JSON.parse(JSON.stringify(this.data1[num]));
                this.modal2 = true;
                Cookies.set('res_num', num);
                Cookies.set('res_index', this.page.pageIndex);

            }
        },

    };
</script>
