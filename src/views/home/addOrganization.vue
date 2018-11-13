<template>
    <div style="    margin:85px 0 0 110px ;
    width: 351px;">

        <Form :model="formItem" :label-width="130" ref="formItem" :rules="ruleValidate">
            <FormItem label="描述" prop="desc">
                <Input v-model="formItem.desc" placeholder="请填写描述"></Input>
            </FormItem>
            <FormItem label="组织机构全称" prop="fullName">
                <Input v-model="formItem.fullName" placeholder="请填写组织机构全称"></Input>
            </FormItem>
            <FormItem label="组织机构编码" prop="orgCode">
                <Input v-model="formItem.orgCode" placeholder="请填写组织机构编码"></Input>
            </FormItem>
            <FormItem label="组织机构简称" prop="orgName">
                <Input v-model="formItem.orgName" placeholder="请填写组织机构简称"></Input>
            </FormItem>
            <FormItem label="租户+上级组织机构" props="org">
                <Cascader :data="data" v-model="value1" style="width: 160px; margin-bottom: 20px;"></Cascader>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="oks('formItem')" style="margin-right: 30px; margin-left:30px;">确定
                </Button>
                <Button @click="onCanel">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        props: [],
        created () {
             Cookies.remove('home_index');
            this.organizationFindGroup_Name();
        },
        methods: {
            CascaderIsName (item) {
                return item.map(r => {
                    if (r.hasOwnProperty('voList')) {
                        return {
                            label: r.tenantName,
                            value: r.tenantId + `_${r.tenantName}`,
                            children: this.CascaderIsName(r.voList)
                        };
                    } else {
                        return {
                            value: r.organizationId + `_${r.organizationName}`,
                            label: r.organizationName,
                        };
                    }

                });
            },
            oks (name) {

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.value1.length !== 0) {
                            this.$axios({
                                method: 'post',
                                url: api.organizationAdd(),
                                data: {
                                    description: this.formItem.desc,
                                    fullName: this.formItem.fullName,
                                    organizationCode: this.formItem.orgCode,
                                    organizationName: this.formItem.orgName,
                                    parentId: this.value1[1].split('_')[0],
                                    tenantId: this.value1[0].split('_')[0]
                                },
                                headers: {
                                    Authorization: Cookies.get('token'),
                                    'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }).then(res => {
                                if (res.data.code == 200) {
                                    this.$router.push({path: '/organization-management-system'});

                                } else {
                                    this.$Message.info(res.data.msg);
                                }
                            });
                        } else {
                            this.$Message.info('信息不完整');
                        }
                    }else{
                        this.$Message.error('信息不正确');
                    }
                });

            },
            onCanel () {
                this.$router.push({path: '/organization-management-system'});
            },
            organizationFindGroup_Name () {
                this.$axios({
                    method: 'get',
                    url: api.organizationFindGroupName("true"),
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.data = this.CascaderIsName(res.data.data);
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            }
        },
        name: 'add-organization',
        data () {
            return {
                ruleValidate: {
                    desc: [
                        {required: false, message: '请输入描述', trigger: 'blur'}
                    ],
                    orgCode: [
                        {required: true, message: '请输入组织机构编码', trigger: 'blur'}
                    ],
                    orgName: [
                        {required: true, message: '请输入组织机构简称', trigger: 'blur'},
                    ],
                    org: [
                        {required: true, message: '请输入租户+上级组织机构', trigger: 'blur'},
                    ],
                },
                parentId: [],
                tenantId: [],
                value1: [],
                data: [],
                formItem: {
                    desc: '',
                    fullName: '',
                    orgCode: '',
                    orgName: '',
                },
            };
        }
    };
</script>

<style scoped>

</style>