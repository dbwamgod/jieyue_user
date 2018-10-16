<template>
    <div style="    margin:85px 0 0 110px ;
        width: 351px;" >
        <Form :model="formLeft" label-position="left" :label-width="100">
            <FormItem label="描述">
                <Input v-model="formLeft.description"></Input>
            </FormItem>
            <FormItem label="组织机构全称">
                <Input v-model="formLeft.fullName"></Input>
            </FormItem>
            <FormItem label="组织机构编码">
                <Input v-model="formLeft.organizationCode"></Input>
            </FormItem>
            <FormItem label="组织机构简称">
                <Input v-model="formLeft.organizationName"></Input>
            </FormItem>
        </Form>

        <Button type="primary" @click="oks" style="margin-right: 40px">确定</Button>
        <Button @click="onCanel">返回</Button>

    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        created () {

            this.formLeft = JSON.parse(this.$route.query.data6);
        },
        watch: {
            '$route.query.data6': {
                handler (a, b) {
                    if (a) {
                        this.formLeft = a;
                    }
                    if (b) {
                        this.formLeft = b;
                    }
                },
                immediate: true
            }

        },
        name: 'update',
        data () {
            return {
                formLeft: {
                    description: '',
                    fullName: '',
                    organizationCode: '',
                    organizationName: '',
                    organizationId: ''
                }
            };
        },
        methods: {
            oks () {
                this.$axios({
                    method: 'post',
                    url: api.organizationUpdate(),
                    data: {
                        description: this.formLeft.description,
                        fullName: this.formLeft.fullName,
                        organizationCode: this.formLeft.organizationCode,
                        organizationName: this.formLeft.organizationName,
                        organizationId: this.formLeft.organizationId,
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
                this.$router.push({path: '/organization-management-system'});
            },
        }
    };
</script>

<style scoped>

</style>