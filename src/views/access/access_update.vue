<template>
    <div style="    margin:85px 0 0 110px ;
        width: 351px;">
        <Form :model="formLeft" :rules="ruleValidate" :label-width="100" ref='contractForm'>
            <FormItem label="描述">
                <Input v-model="formLeft.description"></Input>
            </FormItem>
            <FormItem label="排序号" prop="orderNo">
                <Input v-model="formLeft.orderNo"></Input>
            </FormItem>
            <FormItem label="角色名" prop="roleName">
                <Input v-model="formLeft.roleName"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="oks" style="margin: 10px 15px 0 0;">确定</Button>
                <Button @click="onCanel" style="margin-top: 10px;">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        created () {
            this.formLeft = JSON.parse(this.$route.query.data);
            Cookies.set("flag",true)
        },
        name: 'tenant-update',
        data () {
            return {
                ruleValidate: {
                    orderNo: [
                        {required: false, message: '只允许数字形式', trigger: 'blur', pattern: /^\d+$/},
                    ],
                    roleName: [
                        {required: true, message: '请填写角色名称', trigger: 'blur'},
                    ],
                },
                formLeft: {
                    description: '',
                    orderNo: 100,
                    roleId: 0,
                    roleName: 'string'
                }
            };
        },
        methods: {
            oks () {
                this.$axios({
                    method: 'post',
                    url: api.role_update(),
                    data: {
                        description: this.formLeft.description,
                        orderNo: this.formLeft.orderNo,
                        roleId: this.formLeft.roleId,
                        roleName: this.formLeft.roleName,
                        userId: Cookies.get('user_userId')
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        this.$router.back(-1);
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            onCanel () {
                this.$router.back(-1);
            },
        }
    };
</script>

<style scoped>

</style>