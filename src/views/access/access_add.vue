<template>
    <div style="    margin:85px 0 0 110px ;
    width: 351px;">
        <Form ref="formItem" :model="formItem" :label-width="120" :rules="ruleInline">
            <FormItem label="邮箱" prop="email">
                <Input v-model="formItem.email" placeholder="请填写邮箱"></Input>
            </FormItem>
            <FormItem label="员工编号" prop="employeeCode">
                <Input v-model="formItem.employeeCode" placeholder="请填写员工编号"></Input>
            </FormItem>
            <FormItem label="手机号" prop="mobile">
                <Input v-model="formItem.mobile" placeholder="请填写手机号"></Input>
            </FormItem>
            <FormItem label="昵称" prop="nickname">
                <Input v-model="formItem.nickname" placeholder="请填写昵称"></Input>
            </FormItem>
            <FormItem label="排序号" prop="orderNo">
                <Input v-model="formItem.orderNo" placeholder="请填写排序号"></Input>
            </FormItem><!--
            <FormItem label="组织机构id" prop="organizationId">
                <Input v-model="formItem.organizationId" placeholder="请填写组织机构id"></Input>
            </FormItem>-->
            <FormItem label="租户+组织机构" prop="organizationId">
                <Cascader :data="data1" v-model="formItem.organizationId"></Cascader>
            </FormItem>
            <FormItem label="密码" prop="pswd">
                <Input type="password" v-model="formItem.pswd" placeholder="请填写密码"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="oks('formItem')" ref="index">确定</Button>
                <Button @click="onCanel">返回</Button>
            </FormItem>

        </Form>

    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        created () {
            this.init();
            this.$store.commit("bindingChange")
            Cookies.remove('user_index');

        },
        inject: ['reload'],
        methods: {
            init () {
                this.$axios({
                    method: 'get',
                    url: api.organizationFindGroupName(),
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
                            label: r.organizationName || r.tenantName,
                            value: r.organizationId || r.tenantId,
                            children: this.CascaderIsName(r.voList)
                        };
                    } else {
                        return {
                            label: r.tenantName || r.organizationName,
                            value: r.tenantId || r.organizationId,
                        };
                    }

                });
            },
            oks (name) {

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$axios({
                            method: 'post',
                            url: api.userAdd(),
                            data: {
                                tenantId: this.formItem.organizationId[0],
                                currentUserId: Cookies.get('user_userId'),
                                email: this.formItem.email,
                                employeeCode: this.formItem.employeeCode,
                                mobile: this.formItem.mobile,
                                nickname: this.formItem.nickname,
                                orderNo: this.formItem.orderNo,
                                organizationId: this.formItem.organizationId[1],
                                pswd: this.formItem.pswd,
                            },
                            headers: {
                                Authorization: Cookies.get('token'),
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.formItem = {};
                                this.formItem.orderNo = '100';
                                this.$router.back(-1);

                            } else {
                                this.$Message.info(res.data.msg);
                                /*
                                this.$refs.index.disabled = true;
                                let SET = setTimeout(() => {
                                    this.$refs.index.disabled = false;
                                    clearTimeout(SET);
                                }, 1500);*/

                            }
                        });
                    } else {
                        this.$Message.error('请输入正确的信息!');
                    }
                });

            },
            onCanel () {
                this.$router.back(-1);
                this.formItem = {};
                this.formItem.orderNo = '100';
                this.reload();
            },
        },
        name: 'access_add',
        data () {
            return {
                data1: [],
                itemName: [],
                value1: [],
                data: [],
                ruleInline: {
                    employeeCode: [
                        {required: true, type: 'string', pattern: /^\d+$/, message: '请输入正确的员工编号', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入正确的邮箱', trigger: 'blur'},
                    ],
                    mobile: [
                        {required: true, type: 'string', pattern: /^\d+$/, message: '请输入正确的手机', trigger: 'blur'},
                    ],
                    nickname: [
                        {required: false, message: '请输入正确的昵称', trigger: 'blur'},
                    ],
                    orderNo: [
                        {required: false, type: 'string', pattern: /^\d+$/, message: '请输入正确的序号', trigger: 'blur'},
                    ],
                    organizationId: [
                        {required: true, message: '请输入正确的组织机构'},
                    ],
                    pswd: [
                        {required: true, message: '请输入正确的密码', trigger: 'blur'},
                    ]
                },
                formItem: {
                    currentUserId: '',
                    email: '',
                    employeeCode: '',
                    mobile: '',
                    nickname: '',
                    orderNo: '' || '100',
                    organizationId: [],
                    pswd: '',

                },

            };
        }
    };
</script>

<style scoped>

</style>