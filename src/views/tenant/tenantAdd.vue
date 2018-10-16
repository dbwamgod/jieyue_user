<template>

        <div style="    margin:85px 0 0 110px ;
        width: 351px;">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem label="描述" prop="description">
                    <Input v-model="formValidate.description" placeholder="描述"></Input>
                </FormItem>
                <FormItem label="排序号" prop="orderNo">
                    <Input v-model="formValidate.orderNo" placeholder="排序号"></Input>
                </FormItem>
                <FormItem label="租户编码" prop="tenantCode">
                    <Input v-model="formValidate.tenantCode" placeholder="租户编码"></Input>
                </FormItem>
                <FormItem label="租户名" prop="tenantName">
                    <Input v-model="formValidate.tenantName" placeholder="租户名"></Input>
                </FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')" style="margin: 10px 25px 0 30px">确定</Button>
                <Button @click="NO_handleSubmit">返回</Button>
            </Form>
        </div>

</template>

<script>
    import api from "@/api"
    import Cookies from 'js-cookie';
    export default {
        name: 'tenant-add'
        , data () {
            return {
                tenantData:{},
                formValidate: {
                    description: '',
                    orderNo: '',
                    tenantCode: '',
                    tenantName: ''
                },
                ruleValidate: {

                    tenantCode: [
                        {required: true, message: '租户编码', trigger: 'blur'}
                    ],
                    tenantName: [
                        {required: true, message: '租户名', trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            handleSubmit (name) {
                this.$axios({
                    method: 'post',
                    url: api.tenant_Add(),
                    data: {
                        description: this.formValidate.description,
                        orderNo: this.formValidate.orderNo,
                        tenantCode: this.formValidate.tenantCode,
                        tenantName: this.formValidate.tenantName,
                        userId: Cookies.get('user_userId')
                    },
                    headers:{
                        Authorization:Cookies.get("token"),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res=>{
                    if (res.data.code==200){

                    this.$Message.info("信息正确")
                        this.$router.back(-1)
                    }else{this.$Message.info(res.data.msg);}

                });

                /*
                                this.$refs[name].validate((valid) => {
                                    if (valid) {
                                        this.$Message.success('Success!');
                                    } else {
                                        this.$Message.error('Fail!');
                                    }
                                });*/
            },
            NO_handleSubmit () {
                this.$router.replace({
                    path: '/tenant'
                });
            },
        }
    };
</script>

<style scoped>

</style>