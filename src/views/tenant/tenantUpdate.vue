
<template>
    <div style="    margin:85px 0 0 110px ;
        width: 351px;">
        <Form :model="formLeft" label-position="left" :label-width="100">
            <FormItem label="描述">
                <Input v-model="formLeft.description"></Input>
            </FormItem>
            <FormItem label="排序号">
                <Input v-model="formLeft.orderNo"></Input>
            </FormItem>
            <FormItem label="租户编号">
                <Input v-model="formLeft.tenantCode"></Input>
            </FormItem>
            <FormItem label="租户名">
                <Input v-model="formLeft.tenantName"></Input>
            </FormItem>
        </Form>

        <Button type="primary" @click="oks">确定</Button>
        <Button @click="onCanel">返回</Button>

    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';
    export default {
        created(){
             this.formLeft=this.$route.query.data6
        },
        name: 'tenant-update',
        data(){
            return{

                formLeft:{
                    description:'',
                    orderNo:'',
                    tenantCode:'',
                    tenantName:'',
                    tenantId:''

                }
            }
        },
        methods:{
            oks () {

                this.$axios({
                    method: 'post',
                    url: api.tenant_update(),
                    data: {
                        description: this.formLeft.description,
                        orderNo: this.formLeft.orderNo,
                        tenantCode: this.formLeft.tenantCode,
                        tenantName: this.formLeft.tenantName,
                        userId: Cookies.get("user_userId"),
                        tenantId: this.formLeft.tenantId,
                    },
                    headers:{
                        Authorization:Cookies.get("token"),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res=>{
                    if(res.data.code===200){
                        this.$router.back(-1);
                    }else{
                    this.$Message.info(res.data.msg)
                    }
                });
            },
            onCanel () {
                this.$router.push({path: '/tenant'});
            },
        }
    };
</script>

<style scoped>

</style>