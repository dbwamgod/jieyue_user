<template>
    <div>
        <div style="    margin:85px 0 0 110px ;
        width: 351px;">

            <Form v-model="formLeft" label-position="left" :label-width="100">
                <FormItem label="描述">
                    <Input v-model="formLeft.description"></Input>
                </FormItem>
                <FormItem label="排序号">
                    <Input v-model="formLeft.orderNo"></Input>
                </FormItem>
                <FormItem label="资源名">
                    <Input v-model="formLeft.resourceName"></Input>
                </FormItem>
                <FormItem label="url路径">
                    <Input v-model="formLeft.url" :disabled="formLeft.url?false:true"></Input>
                </FormItem>

                <FormItem label="是否为菜单" prop="isMenu">
                    <RadioGroup v-model="formLeft.isMenu">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <Button type="primary" @click="oks">确定</Button>
            <Button @click="onCanel">返回</Button>
        </div>
    </div>
</template>

<script>

    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        inject: ['reload'],
        name: 'res_update',
        data () {
            return {
                formLeft: {
                    description: '',
                    orderNo: 100,
                    resourceName: '',
                    resourceId: [],
                    url: '',
                    isMenu: ''
                },
            };
        },
        created () {
            this.formLeft = JSON.parse(this.$route.query.data1);

        },

        watch: {
            '$route.query.data1': {

                handler (a, b) {
                    if (typeof a === 'string') {
                        this.formLeft = JSON.parse(a);
                    }

                }
            }
        },

        methods: {
            oks () {
                this.$axios({
                    method: 'post',
                    url: api.res_update(),
                    data: {
                        description: this.formLeft.description || '无',
                        orderNo: this.formLeft.orderNo || 100,
                        resourceId: this.formLeft.resourceId,
                        isMenu: this.formLeft.isMenu,
                        resourceName: this.formLeft.resourceName,
                        url: this.formLeft.url,
                        userId: Cookies.get('userId'),
                        parentId: this.$route.query.data1.parentId
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



