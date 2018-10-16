<template>
    <div style="    margin:85px 0 0 110px ;
        width: 351px;">
        <Form ref="formRight" :model="formRight" label-position="right" :label-width="100" :rules="ruleInline">
            <FormItem label="描述">
                <Input v-model="formRight.description"></Input>
            </FormItem>
            <FormItem label="资源名" prop="resourceName">
                <Input v-model="formRight.resourceName"></Input>
            </FormItem>
            <FormItem label="租户+上级资源">
                <Cascader :data="data1" v-model="value1"></Cascader>
            </FormItem>
            <FormItem label="资源地址" prop="url" v-show="isShow">
                <Input v-model="formRight.url"></Input>
            </FormItem>
            <FormItem label="资源地址" prop="mustUrl" v-show="!isShow">
                <Input v-model="formRight.mustUrl"></Input>
            </FormItem>
            <FormItem label="资源编码" prop="resourceCode">
                <Input v-model="formRight.resourceCode"></Input>
            </FormItem>
            <FormItem label="是否为菜单" prop="isMenu">
                <RadioGroup v-model="formRight.isMenu">
                    <Radio label="1">是</Radio>
                    <Radio label="0">否</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        <Form style="margin-left: 100px">
            <FormItem>
                <Button type="primary" @click="handleSubmit('formRight')">确定</Button>
                <Button @click="handleReset" style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<style scoped>
    .paging {
        float: right;
        margin-top: 10px;
    }
</style>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                isShow: false,
                value1: [],
                formRight: {
                    description: '',
                    resourceName: '',
                    url: '',
                    mustUrl: '',
                    resourceCode: '',
                    isMenu: 0
                },
                tenantId: [],
                data1: [{
                    value: '',
                    label: '',
                }, {
                    value: '',
                    label: '',
                }],
                ruleInline: {
                    description: [{required: false, message: '请输入信息描述', trigger: 'blur'}],
                    resourceName: [{required: true, message: '请输入资源名称', trigger: 'blur'}, {
                        type: 'string',
                        message: '请输入正确的资源名',
                        trigger: 'blur'
                    }],
                    url: [{required: false, trigger: 'blur'}],
                    mustUrl: [{required: true, message: '请输入资源路径', trigger: 'blur'}],
                    resourceCode: [{required: true, message: '请输入资源编码', trigger: 'blur'}]
                }
            };
        },
        created () {
            this.init();
            Cookies.remove('res_index');
        },
        watch: {
            'formRight.isMenu' (to, form) {
                if (to == 1) {
                    //this.$refs.formRight.resetFields();
                    this.ruleInline.mustUrl = [];
                    // this.formRight.mustUrl = this.formRight.url;
                    this.formRight.url = this.formRight.mustUrl;
                    this.isShow = true;


                    // this.ruleInline.url=[{required: true, message: '请输入url路径', trigger: 'blur'}]
                } else {
                    this.ruleInline.mustUrl = [{required: true, message: '请输入资源路径', trigger: 'blur'}];
                    this.formRight.mustUrl = this.formRight.url
                    this.isShow = false;


                }
            }
        },
        methods: {
            init () {

                this.$axios({
                    method: 'get',
                    url: api.res_lists(),
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.data1 = this.CascaderIsName(res.data.data);
                    } else {
                        this.$Message.info(res.data.msg);
                    }

                });

            },
            CascaderIsName (item) {
                return item.map(r => {
                    if (r.hasOwnProperty('voList')) {
                        return {
                            label: r.tenantName || r.resourceName,
                            value: r.tenantId || 0,
                            children: this.CascaderIsName(r.voList)
                        };
                    } else {
                        return {
                            label: r.tenantName || r.resourceName,
                            value: r.resourceId || 0,
                        };
                    }

                });
            },

            handleSubmit (flag) {

                this.$refs.formRight.validate((valid) => {
                    if (valid) {
                        // if(!flag){
                        this.$axios({
                            method: 'post',
                            url: api.res_add(),
                            data: {
                                isMenu: Number(this.formRight.isMenu),
                                description: this.formRight.description,
                                parentId: this.value1[1],
                                resourceName: this.formRight.resourceName,
                                tenantId: this.value1[0],
                                url: this.formRight.url,
                                resourceCode: this.formRight.resourceCode,
                                userId: Cookies.get('user_userId')
                            },
                            headers: {
                                Authorization: Cookies.get('token'),
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                let query = this.formRight;
                                this.$router.back(-1);
                            } else {
                                this.$Message.info(res.data.msg);
                            }

                        });
                    } else {
                        this.$Message.info('请输入有效信息');
                    }
                });
            },
            handleReset () {
                this.$router.back(-1);
            }
        }
    };
</script>
