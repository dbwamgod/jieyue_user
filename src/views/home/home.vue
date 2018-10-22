<template>
    <div class="list_page">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="4">
            <h2 class="com_header">组织机构管理</h2>
            </Col>
            <Col class="operation">
            <Input size="large" v-model="searchWord" placeholder="请输入组织机构简称..." class="com_search"/>
            <Button type="primary" @click="searchChange">
                <Icon type="ios-search-strong" style=" font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="add_ops" v-if="adds">新增组织机构管理</Button>
            </Col>
        </Row>
        <Table border :columns="columns7" :data="data6" :loading='SpinType' class="com_table"></Table>
        <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging"
              @on-change="changepage"></Page>
        <Modal
                v-model="modal2"
                title="修改信息"
                :footer-hide='true'
                :closable="false"
                :mask-closable="false">

            <Form ref="formItem" :model="formItem" :rules="ruleInline">
                <FormItem prop="description" label="描述">
                    <Input type="text" v-model="formItem.description" placeholder="描述">
                    </Input>
                </FormItem>
                <FormItem prop="fullName" label="组织机构全称">
                    <Input type="text" v-model="formItem.fullName" placeholder="组织机构全称">
                    </Input>
                </FormItem>
                <FormItem prop="organizationCode" label="组织机构编码">
                    <Input type="text" v-model="formItem.organizationCode" placeholder="组织机构编码">
                    </Input>
                </FormItem>
                <FormItem prop="organizationName" label="组织机构简称">
                    <Input type="text" v-model="formItem.organizationName" placeholder="组织机构简称">
                    </Input>
                </FormItem>
            </Form>
            <div class="sure-cancel">
                <Button type="primary" @click="sure" class="sure_edit">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style scoped>

</style>
<script>
    import api from '@/api';
    import util from "@/libs/util.js"
    import Cookies from 'js-cookie';
    export default {
        inject: ['reload'],
        data () {
            return {
                SpinType: false,
                ruleInline: {
                    organizationCode: [
                        {required: true, message: '请输入组织机构编码且为数字', trigger: 'blur'}
                    ],
                    organizationName: [
                        {required: true, message: '请输入组织机构简称', trigger: 'blur'}
                    ],
                },
                modal2: false,
                formItem: {
                    description: '',
                    fullName: '',
                    organizationCode: '',
                    organizationName: '',
                },
                searchWord: '',
                dataCount: 0,
                page: {
                    pageIndex: 1,
                    pageSize: 10
                },
                columns7: [
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
                                }, '删除') : '',
                            ]);
                        }
                    }
                ],
                data6: [],
                adds:false,
                /*是否为全部显示*/
                flag: 0,
                searchInfo: false,
                operation: {
                    edit: false,
                    del: false,
                    edit_del:false,
                },
                real: []
            };
        },
        computed: {},
        created () {

            util.jurisdiction(this,'查询组织机构列表','新增组织机构','修改组织机构','删除组织机构')
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
        methods: {
            //确定修改
            sure () {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        this.$axios({
                            method: 'post',
                            url: api.organizationUpdate(),
                            data: {
                                description: this.formItem.description,
                                fullName: this.formItem.fullName,
                                organizationCode: this.formItem.organizationCode,
                                organizationName: this.formItem.organizationName,
                                organizationId: this.formItem.organizationId,
                            },
                            headers: {
                                Authorization: Cookies.get('token'),
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            if (res.data.code === 200) {
                                let replace_data = this.data6[Cookies.get('org_num')];
                                replace_data.description = this.formItem.description;
                                replace_data.fullName = this.formItem.fullName;
                                replace_data.organizationCode = this.formItem.organizationCode;
                                replace_data.organizationName = this.formItem.organizationName;
                                this.$Message.info('已修改');
                                this.check_list();
                                this.modal2 = false;
                            } else {
                                this.$Message.info(res.data.msg);

                            }
                        });
                    } else {
                        this.$Message.error('组织机构编码不能为空!');
                    }
                });

            },
            //取消修改
            cancel () {
                let a = this.data6.map(r => {
                    if (r.userId === this.real.userId) {
                        r:Object.assign({}, ...this.real);
                    }
                });
                this.$refs.formItem.resetFields();

                this.modal2 = false;
                this.$Message.info('已取消');
            },
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
            check_list () {
                this.SpinType = true;
                this.$axios({
                    method: 'post',
                    url: api.organizationList(),
                    data: {
                        keyword: this.$store.state.app.orgSearchFlag || '',
                        currentPage: this.searchInfo ? this.page.pageIndex || 1 : this.page.pageIndex || 1,
                        pageSize: this.page.pageSize
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.SpinType = false;
                        // if(this.page.pageIndex===0){
                        //     this.page.pageIndex=1
                        //     return
                        // }
                        if (res.data.data) {
                            this.data6 = res.data.data;
                            this.dataCount = res.data.page.totalRecords;
                        } else {
                            if (this.searchInfo) {
                                this.data6 = [];
                                this.dataCount = 0;
                            } else {
                                // this.page.pageIndex=--this.page.pageIndex||1
                                // this.check_list()
                                this.data6 = [];
                                this.dataCount = 0;
                            }
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
                this.$router.push({path: '/addOrganization', query: {data6: this.data6}});
            },
            //修改
            edit (num) {
                this.formItem = JSON.parse(JSON.stringify(this.data6[num]));
                this.real = JSON.parse(JSON.stringify(this.data6[num]));
                this.modal2 = true;
                Cookies.set('org_num', num);
                Cookies.set('home_index', this.page.pageIndex);
                /*this.$router.push({
                    name: 'origin_update',
                    query: {data6: JSON.stringify(this.data6[num])}
                });*/
            },
            //删除
            remove (index) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>您确定要删除该组织吗</p>',
                    loading: true,
                    onOk: () => {
                        setTimeout(() => {
                            // Cookies.set('del',this.page.pageIndex)
                            this.$axios({
                                method: 'post',
                                url: api.organizationDel(),
                                data: {
                                    organizationId: this.data6[index].organizationId,
                                    userId: Cookies.get('userId')
                                },
                                headers: {
                                    Authorization: Cookies.get('token'),
                                    'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }).then(res => {
                                if (res.data.code == 200) {
                                    if (this.data6.length < 2) {

                                        this.$axios({
                                            method: 'post',
                                            url: api.organizationList(),
                                            data: {
                                                keyword: this.searchWord,
                                                currentPage: this.page.pageIndex ? 1 : --this.page.pageIndex,
                                                pageSize: this.page.pageSize
                                            },
                                            headers: {
                                                Authorization: Cookies.get('token'),
                                                'Content-Type': 'application/json;charset=UTF-8'
                                            }
                                        }).then(res => {
                                            if (res.data.code == 200) {
                                                if (this.page.pageIndex > 1) {
                                                    --this.page.pageIndex;
                                                }
                                                if (res.data.data) {
                                                    this.data6 = res.data.data;
                                                    this.dataCount = res.data.page.totalRecords;
                                                } else {
                                                    if (res.data.page) {
                                                        this.dataCount = 0;
                                                        this.data6 = [];
                                                    } else {
                                                        this.data6 = [];
                                                        this.dataCount = 0;
                                                    }
                                                }
                                            } else {
                                                this.$Message.info(res.data.msg);
                                            }
                                        });
                                    } else {
                                        this.$Message.info('已删除');
                                        this.searchInfo = true;
                                        this.check_list();
                                    }
                                    this.$Modal.remove();
                                    // this.check_list()
                                } else if (res.data.code == 400) {
                                    this.$Modal.remove();
                                    this.$Message.info('存在下级机构 不能删除/组织机构id不能小于1');
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.info(res.data.msg);
                                }

                            });
                        }, 0);
                    }
                });
            },
        }

    };
</script>
<style lang="less">
/*    .sure-cancel {
        margin-left: 70%;
        .sure_edit {
            margin-right: 20px;
        }
    }

    .org_table {
        margin: 5px 15px 0 15px;
    }

    .code-row-bg {
        margin-bottom: 10px;
        .org_header {
            margin: 6px 0 0 20px
        }
        .operation {
            text-align: right;
            width: 52%;
            margin-right: 15px;
            .org_search {
                width: 35%;
                height: 34px;
            }
        }
    }

    .paging {
        float: right;
        margin-top: 10px;
    }*/

</style>





