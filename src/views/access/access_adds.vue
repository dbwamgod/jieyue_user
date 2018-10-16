<template>
    <div style="    margin:85px 0 0 110px ;
        width: 351px;">

        <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" >
            <FormItem label="描述" prop="description">
                <Input v-model="formItem.description" placeholder="请填写描述"></Input>
            </FormItem>
            <FormItem label="排序号" prop="orderNo">
                <Input v-model="formItem.orderNo" placeholder="请填写排序"></Input>
            </FormItem>
            <FormItem label="角色名" prop="roleName">
                <Input v-model="formItem.roleName" placeholder="请填写角色名"></Input>
            </FormItem>
            <p style="margin-left: 83px">{{ text }}</p>
            <FormItem label="租户">
                <!--<span style="    padding: 0 15px 0 10px;">租户</span>-->

                <Cascader :data="data" @on-change="handleChange">

                    <a href="javascript:void(0)"
                       style="display: inline-block;width: 100px;text-align: center;line-height: 32px;height: 32px; border: 1px solid #555; border-radius: 10%; opacity: .3; color: #000000">请点击选择</a>
                </Cascader>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="oks('formItem')" style="margin: 35px 10px 0 40px;">确定</Button>
                <Button @click="onCanel" style="margin-top: 35px">返回</Button>
            </FormItem>

        </Form>

    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        inject:['reload'],
        created () {
            this.init();
            this.$store.commit("bindingChangeRes")
            Cookies.remove('role_index');

        },
        mounted(){

        },
        methods: {

            init () {
                this.$axios({
                    method: 'get',
                    url: api.tenant_ListId(),
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.tenantInfo = res.data.data;
                        this.data = this.tenantInfo.map((item, index) => {
                            return {
                                value: item.tenantId,
                                label: item.tenantName
                            };
                        });
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            oks (name) {

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.text !== '未选择') {
                            this.$axios({
                                method: 'post',
                                url: api.role_add(),
                                data: {
                                    description: this.formItem.description,
                                    orderNo: this.formItem.orderNo,
                                    roleName: this.formItem.roleName,
                                    tenantId: this.id,
                                    userId: Cookies.get('user_userId')
                                },
                                headers: {
                                    Authorization: Cookies.get('token'),
                                    'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }).then(res => {

                                if (res.data.code == 200) {
                                    this.$router.back(-1);
                                    this.formItem = {};
                                    this.formItem.orderNo = '100';
                                    this.text = '未选择';
                                } else if (res.data.code == 500) {
                                    this.$Message.info('您的参数有误');
                                } else {
                                    if (this.text === '未选择') {
                                        this.$Message.info('未选择租户');
                                    } else {
                                        this.$Message.info(res.data.msg);
                                    }

                                }

                            });
                        } else {
                            this.$Message.info('未选择租户');
                        }
                    } else {
                        this.$Message.info('请输入正确的信息');
                    }
                });

            },
            onCanel () {
                this.$router.back(-1);
                this.formItem = {};
                this.formItem.orderNo = '100';
                this.text = '未选择';
                this.reload()

            },
            handleChange (value, selectedData) {
                this.text = selectedData.map(o => o.label).join(', ');
                this.id = selectedData.map(o => o.value).join(', ');
            }
        },
        name: 'access_add',
        data () {
            return {
                ruleValidate: {
                    roleName: [
                        {required: true, message: '角色名不能为空', trigger: 'blur'},
                    ],
                    orderNo: [
                        {required: false, type: 'string', pattern: /^\d+$/, message: '请输入正确的序号', trigger: 'blur'},
                    ],
                },
                id: '',
                tenantInfo: '',
                text: '未选择',
                data: [],
                formItem: {
                    description: '',
                    orderNo: '' || '100',
                    roleName: '',
                },

            };
        }
    };
</script>

<style scoped>

</style>
