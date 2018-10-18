<template>

    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="6">
            <h2 style="margin: 6px 0 0 20px">三方系统</h2>
            </Col>
            <Col span="3" style='text-align:right;margin-right:5px;'>
            <Button type="primary" @click="addTenant" v-if="addResource">新增客户端授权</Button>
            </Col>
        </Row>
        <Row>
            <Col>
            <Table border :columns="columns7" :data="data6" :loading='SpinType'
                   style="margin: 5px 15px 0 15px;"></Table>
            </Col>
        </Row>
        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>


        <Modal
                v-model="modal2"
                title="修改信息"
                :footer-hide='true'
                :closable="false"
                :mask-closable="false">

            <Form ref="formItem" :model="formItem" :rules="ruleInline" style="width: 90%;">
                <FormItem prop="clientId" label="客户端ID">
                    <Input type="text" v-model="formItem.clientId" placeholder="请输入客户端ID"></Input>
                </FormItem>
                <FormItem prop="authorities" label="权限值">
                    <Input type="text" v-model="formItem.authorities" placeholder="请输入权限值"></Input>
                    <Poptip trigger="hover" :content="popTip" style="position: absolute;left: 100%;top: 58%;">
                        <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                    </Poptip>
                </FormItem>
                <FormItem prop="scope" label="权限范围">
                    <Input type="text" v-model="formItem.scope" placeholder="请输入权限范围"></Input>
                    <Poptip trigger="hover" :content="popTip" style="position: absolute;left: 100%;top: 58%;">
                        <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                    </Poptip>
                </FormItem>
                <FormItem prop="authorizedGrantTypes" label="授权类型">
                    <Input type="text" v-model="formItem.authorizedGrantTypes" placeholder="请输入授权类型"></Input>
                    <Poptip trigger="hover" :content="popTip" style="position: absolute;left: 100%;top: 58%;">
                        <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                    </Poptip>
                </FormItem>
                <FormItem prop="accessTokenValidity" label="票据有效期">
                    <Input type="text" v-model="formItem.accessTokenValidity" placeholder="请输入票据有效期"></Input>
                    <Poptip trigger="hover" :content="PopCon" style="position: absolute;left: 100%;top: 58%;">
                        <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                    </Poptip>
                </FormItem>
                <FormItem prop="refreshTokenValidity" label="刷新票据有效期">
                    <Input type="text" v-model="formItem.refreshTokenValidity" placeholder="请输入刷新票据有效期"></Input>
                    <Poptip trigger="hover" :content="refPopCon" style="position: absolute;left: 100%;top: 58%;">
                        <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                    </Poptip>
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
    import Cookies from 'js-cookie';
    import api from '@/api';

    export default {
        computed: {},
        components: {},
        data () {
            return {
                refPopCon:"(单位:秒; 默认值:2592000秒, 即30天)",
                PopCon:"(单位:秒; 默认值:43200秒, 即12小时)",
                popTip:"多个值用逗号隔开",
                operation: {
                    edit: true,
                    del: true,
                    edit_del: true,
                },
                SpinType: false,
                active: true,
                page: {
                    pageSize: 10,
                    pageIndex: 1,
                },
                modal2: false,
                formItem: {
                    clientId: '',
                    authorities: '',
                    scope: '',
                    authorizedGrantTypes: '',
                    accessTokenValidity: '',
                    refreshTokenValidity: '',
                    id: ''
                },
                dataCount: 0,
                addResource: false,
                columns7: [
                    {
                        title: '客户端ID',
                        key: 'clientId'
                    },
                    {
                        title: '权限值',
                        key: 'authorities'
                    },
                    {
                        title: '权限范围',
                        key: 'scope'
                    },
                    {
                        title: '授权类型',
                        key: 'authorizedGrantTypes',
                    },
                    {
                        title: '票据有效期',
                        key: 'accessTokenValidity'
                    },
                    {
                        title: '刷新票据有效期',
                        key: 'refreshTokenValidity'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: '150px',
                        render: (h, params) => {
                            return h('div', [
                                this.operation.edit || this.operation.edit_del ? h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: params.index === 0 ? true : false
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editF(params.row.id, params.index);
                                        }
                                    }
                                }, '修改') : '',
                              /*  this.operation.del || this.operation.edit_del ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        disabled: params.index === 0 ? true : false
                                    }, style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            // this.remove(params.index);
                                            this.data6.splice(params.index, 1);
                                            this.dataCount--;
                                        }
                                    }
                                }, '删除') : ''*/
                            ]);
                        },
                    }
                ],
                data6: [],
                ruleInline: {
                    clientId: [
                        {required: true, type: 'string', pattern: /\S/, message: '请输入正确的客户端ID', trigger: 'blur'}
                    ],
                },
                cloneformItem: []
            };
        },
        created () {
            if (JSON.parse(localStorage.getItem('Jurisdiction'))) {
                JSON.parse(localStorage.getItem('Jurisdiction')).forEach(r => {
                    r.child && r.child.forEach(r => {
                        if (r.resourceName == '查询客户端授权列表') {
                            this.loseList = true;
                        } else if (r.resourceName == '新增客户端授权') {
                            this.addResource = true;
                        } else if (r.resourceName == '修改客户端授权') {
                            this.operation.edit = true;
                            this.flag = 1;
                        } else if (r.resourceName == '删除客户端授权') {
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
            this.init();
        },
        methods: {
            changepage (index) {
                this.page.pageIndex = index;
                this.init();
            },
            init () {
                this.SpinType = true;

                this.$axios({
                    method: 'post',
                    url: api.oauthThreeList(),
                    data: {
                        currentPage: this.page.pageIndex,
                        pageSize: this.page.pageSize
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    this.SpinType = false;
                    if (res.data.code == 200) {
                        this.data6 = res.data.data;
                        this.dataCount = res.data.page.totalRecords;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            addTenant () {
                this.$router.push({name: 'add_oauth'});
            },

            editF (id, index) {
                // console.log(this.data6[index]);
                this.formItem.id = id;
                /*this.formItem=JSON.parse(JSON.stringify(this.data6[index]));
                this.cloneformItem=JSON.parse(JSON.stringify(this.data6[index]));*/
                Cookies.set('three_num', index);
                Cookies.set('id', id);
                this.modal2 = true;
                this.$axios({
                    method: 'get',
                    url: api.getoauthThree(id),
                }).then(res => {
                    if (res.data.code == 200) {
                        this.cloneformItem = JSON.parse(JSON.stringify(res.data.data));
                        this.formItem = JSON.parse(JSON.stringify(res.data.data));
                    }
                });
            },
            sure () {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        this.$axios({
                            method: 'post',
                            url: api.editoauthThree(),
                            data: {
                                clientId: this.formItem.clientId,
                                authorities: this.formItem.authorities,
                                scope: this.formItem.scope,
                                authorizedGrantTypes: this.formItem.authorizedGrantTypes,
                                accessTokenValidity: this.formItem.accessTokenValidity,
                                refreshTokenValidity: this.formItem.refreshTokenValidity,
                                id: this.formItem.id || Cookies.get('id'),
                            },
                            headers: {
                                Authorization: Cookies.get('token'),
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            if (res.data.code === 200) {
                                Cookies.remove('id');
                                let replace_data = this.data6[Cookies.get('three_num')];
                                replace_data.clientId = this.formItem.clientId;
                                replace_data.authorities = this.formItem.authorities;
                                replace_data.scope = this.formItem.scope;
                                replace_data.authorizedGrantTypes = this.formItem.authorizedGrantTypes;
                                replace_data.accessTokenValidity = this.formItem.accessTokenValidity;
                                replace_data.refreshTokenValidity = this.formItem.refreshTokenValidity;
                                this.$Message.info('已修改');
                                this.modal2 = false;
                            } else {
                                this.$Message.info(res.data.msg);
                            }
                        });
                    } else {
                        this.$Message.error('客户端ID不能为空!');
                    }
                });
            },
            cancel () {
                this.formItem = this.cloneformItem;
                this.modal2 = false;
            },

        }
    };
</script>
<style scoped>
    .paging {
        float: right;
        margin-top: 10px;
        margin-right: 15px;
    }
</style>
