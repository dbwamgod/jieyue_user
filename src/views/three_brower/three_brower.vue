<template>

    <div class="list_page">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="6">
            <h2 class="com_header">三方系统</h2>
            </Col>
            <Col span="3" class="operation">
            <Button type="primary" @click="addTenant" v-if="adds">新增客户端授权</Button>
            </Col>
        </Row>
        <Row>
            <Col>
            <Table border :columns="columns7" :data="data6" :loading='SpinType'
                   class="com_table"></Table>
            </Col>
        </Row>
        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>
        <Modal
                v-model="modal2"
                title="修改信息"
                :footer-hide='true'
                :closable="false"
                :mask-closable="false"
        >

            <Form ref="formItem" :model="formItem" :rules="ruleInline" style="width: 90% ;">
                <FormItem prop="clientId" label="客户端ID" style="margin-bottom: 5px">
                    <Input type="text" v-model="formItem.clientId" placeholder="请输入客户端ID"></Input>
                    <span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{brower}}</span>
                </FormItem>
                <FormItem prop="authorities" label="权限值" style="margin-bottom: 5px">
                    <Input type="text" v-model="formItem.authorities" placeholder="请输入权限值(多个值用逗号隔开)"></Input>
                    <span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{popTip}}</span>
                </FormItem>
                <FormItem prop="scope" label="权限范围" style="margin-bottom: 5px">
                    <Input type="text" v-model="formItem.scope" placeholder="请输入权限范围(多个值用逗号隔开)"></Input>
                    <span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{popTip}}</span>
                </FormItem>
                <FormItem prop="authorizedGrantTypes" label="授权类型" style="margin-bottom: 5px">
                    <Input type="text" v-model="formItem.authorizedGrantTypes" placeholder="请输入授权类型(多个值用逗号隔开)"></Input>
                    <span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{popTip}}</span>
                </FormItem>
                <FormItem prop="accessTokenValidity" label="票据有效期" style="margin-bottom: 5px">
                    <Input type="text" v-model="formItem.accessTokenValidity" :placeholder="refPopCon"></Input>
                    <span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{PopCon}}</span>
                </FormItem>
                <FormItem prop="refreshTokenValidity" label="刷新票据有效期" style="margin-bottom: 5px">
                    <Input type="text" v-model="formItem.refreshTokenValidity" :placeholder="PopCon"></Input>
                    <span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon> {{refPopCon}}</span>
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
    import Cookies from 'js-cookie';
    import api from '@/api';
    import util from '@/libs/util.js';
    import Edit from '../../common/edit/Edit.vue';

    export default {
        computed: {},
        components: {},
        data () {
            return {

                /* ruleInline: {
                     clientId: [
                         {required: true, type: 'string', pattern: /\S/, message: '请输入正确的信息', trigger: 'blur'},
                     ],
                     authorities: [
                         {required: true, type: 'string', pattern: /\S/, message: '请输入正确的信息', trigger: 'blur'},
                     ],
                     scope: [
                         {required: true, type: 'string', pattern: /\S/, message: '请输入正确的信息', trigger: 'blur'},
                     ],
                     authorizedGrantTypes: [
                         {required: true, type: 'string', pattern: /\d/, message: '请输入正确的信息', trigger: 'blur'},
                     ],
                     accessTokenValidity: [
                         {required: true, type: 'string', pattern: /\d/, message: '请输入正确的信息', trigger: 'blur'},
                     ],
                     refreshTokenValidity: [
                         {required: true, type: 'string', pattern: /\S/, message: '请输入正确的信息', trigger: 'blur'},
                     ],
                 },*/
                brower: '    客户端ID只能为字母、数字、横线下划线',
                PopCon: '请输入正整数(单位:秒; 默认值:2592000秒, 即30天)',
                refPopCon: '请输入正整数(单位:秒; 默认值:43200秒, 即12小时)',
                popTip: '多个值用逗号隔开',
                operation: {
                    edit: false,
                    del: false,
                    edit_del: false,
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
                adds: false,
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
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                this.operation.edit || this.operation.edit_del ? h(Edit, {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: params.row.id === 1 ? true : false,
                                        editData: this.BearingData,
                                        EditRule: this.ruleInline,
                                        check_list: this.init,
                                        apiInfo: api.editoauthThree,
                                        apiInfoId: api.getoauthThree,
                                        id: params.row.id,
                                        index: params.index,
                                        page: this.page.pageIndex
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
                        {
                            required: true,
                            type: 'string',
                            pattern: /^[0-9a-zA-Z_-]{1,}$/,
                            message:" ",
                            trigger: 'blur'
                        }
                    ],
                },
                cloneformItem: [],
                BearingData: [
                    {
                        prop: 'clientId',
                        model: 'clientId',
                        placeholder: '请输入客户端ID',
                        label: '客户端ID',
                        type: 'text',
                        tip: '1',
                        tipInfo:'客户端ID只能为字母、数字、横线下划线'
                    }, {
                        prop: 'authorities',
                        model: 'authorities',
                        placeholder: '请输入权限值(多个值用逗号隔开)',
                        label: '权限值',
                        type: 'text',
                        tip: '1',
                        tipInfo: '多个值用逗号隔开'

                    }, {
                        prop: 'scope',
                        model: 'scope',
                        placeholder: '请输入权限范围(多个值用逗号隔开)',
                        label: '权限范围',
                        type: 'text',
                        tip: '1',
                        tipInfo:  '多个值用逗号隔开'

                    }, {
                        prop: 'authorizedGrantTypes',
                        model: 'authorizedGrantTypes',
                        placeholder: '请输入授权类型(多个值用逗号隔开)',
                        label: '授权类型',
                        type: 'text',
                        tip: '1',
                        tipInfo:  '多个值用逗号隔开'

                    }, {
                        prop: 'accessTokenValidity',
                        model: 'accessTokenValidity',
                        placeholder: '请输入正整数(单位:秒; 默认值:2592000秒, 即30天)',
                        label: '票据有效期',
                        type: 'text',
                        tip: '1',
                        tipInfo: '请输入正整数(单位:秒; 默认值:2592000秒, 即30天)'

                    }, {
                        prop: 'refreshTokenValidity',
                        model: 'refreshTokenValidity',
                        placeholder: '请输入正整数(单位:秒; 默认值:43200秒, 即12小时)',
                        label: '刷新票据有效期',
                        type: 'text',
                        tip: '1',
                        tipInfo: '请输入正整数(单位:秒; 默认值:43200秒, 即12小时)'

                    },
                ]
            };
        },
        created () {

            util.jurisdiction(this, '查询客户端授权列表', '新增客户端授权', '修改客户端授权', '删除客户端授权');

            this.init();

            !this.operation.edit && !this.operation.edit_del && !this.operation.del ? this.columns7.splice(this.columns7.length - 1, 1) : '';
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
                this.formItem.id = id;
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
                let com = this.formItem.accessTokenValidity;
                let cop = this.formItem.refreshTokenValidity;
                let tip = '票据有效期为正整数(单位:秒; 默认值:2592000秒, 即30天)';
                let tips = '刷新票据有效期为正整数(单位:秒; 默认值:43200秒, 即12小时)';

                if (!String(com).indexOf(' ')) {
                    this.$Message.error(tip);
                } else if (!String(cop).indexOf(' ')) {
                    this.$Message.error(tips);
                } else if (Number(com) >= 0 && Number(cop) >= 0) {
                    this.sure_p();
                } else {
                    if (Number(com) < 0) {
                        tip;
                    } else if (Number(cop) < 0) {
                        tips;
                    }
                }
            },
            sure_p () {
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
                                this.$Message.info('已修改');
                                this.modal2 = false;
                                this.init();
                            } else {
                                this.$Message.info(res.data.msg);
                            }
                        });
                    } else {
                        this.$Message.error('客户端ID信息不正确!');
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


    .tip {
        /*position: absolute;*/
        /*top: 54%;*/
        /*left: 102%;*/
        color: #999;
        /*width: 122%;*/
    }

</style>
