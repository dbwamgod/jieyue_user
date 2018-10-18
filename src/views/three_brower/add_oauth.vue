<template>
    <div style="    margin:85px 0 0 110px ; width: 351px;">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <FormItem label="客户端ID" prop="clientId">
                <Input v-model="formValidate.clientId" placeholder="请输入客户端ID"></Input>
            </FormItem>
            <FormItem label="权限值" prop="authorities">
                <Input v-model="formValidate.authorities" placeholder="请输入权限值"></Input>
                <Poptip trigger="hover"  :content="popTip" style="position: absolute;left: 105%;top: 3%;">
                    <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                </Poptip>
            </FormItem>
            <FormItem label="权限范围" prop="scope">
                <Input v-model="formValidate.scope" placeholder="请输入权限范围"></Input>
                <Poptip trigger="hover"  :content="popTip" style="position: absolute;left: 105%;top: 3%;">
                    <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                </Poptip>
            </FormItem>
            <FormItem label="授权类型" prop="authorizedGrantTypes">
                <Input v-model="formValidate.authorizedGrantTypes" placeholder="请输入授权类型"></Input>
                <Poptip trigger="hover"  :content="popTip" style="position: absolute;left: 105%;top: 3%;">
                    <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                </Poptip>
            </FormItem>
            <FormItem label="票据有效期" prop="accessTokenValidity" >
                <Input v-model="formValidate.accessTokenValidity" placeholder="请输入票据有效期"></Input>
                <Poptip trigger="hover"  :content="PopCon" style="position: absolute;left: 105%;top: 3%;">
                    <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                </Poptip>
            </FormItem>
            <FormItem label="刷新票据有效期" prop="refreshTokenValidity" >
                <Input v-model="formValidate.refreshTokenValidity" placeholder="请输入刷新票据有效期"></Input>
                <Poptip trigger="hover"  :content="refPopCon" style="position: absolute;left: 105%;top: 2%;">
                    <Icon type="information-circled" style="color: #2baee9" :size="18"></Icon>
                </Poptip>
            </FormItem>
            <FormItem label="访问密钥" prop="clientSecret">
                <Input type="password"  v-model="formValidate.clientSecret" placeholder="请输入创建时间"></Input>
            </FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')" style="margin: 10px 25px 0 30px">确定</Button>
            <Button @click="NO_handleSubmit" style="margin-top: 10px;">返回</Button>
        </Form>
    </div>

</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                refPopCon:"(单位:秒; 默认值:2592000秒, 即30天)",
                PopCon:"(单位:秒; 默认值:43200秒, 即12小时)",
                popTip:"多个值用逗号隔开",
                tenantData: {},
                formValidate: {
                    clientId: '',
                    authorities: '',
                    scope: '',
                    authorizedGrantTypes: '',
                    accessTokenValidity: '',
                    refreshTokenValidity: '',
                    clientSecret: '',
                },
                ruleValidate: {
                    clientId: [
                        {required: true, message: '请输入正确的客户端ID', trigger: 'blur'}
                    ],

                }
            };
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$axios({
                            method: 'post',
                            url: api.addoauthThree(),
                            data: {
                                clientId:this.formValidate.clientId,
                                authorities:this.formValidate.authorities,
                                scope:this.formValidate.scope,
                                authorizedGrantTypes:this.formValidate.authorizedGrantTypes,
                                accessTokenValidity:this.formValidate.accessTokenValidity,
                                refreshTokenValidity:this.formValidate.refreshTokenValidity,
                                clientSecret:this.formValidate.clientSecret,
                                userId: Cookies.get('user_userId')
                            },
                            headers: {
                                Authorization: Cookies.get('token'),
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            if (res.data.code == 200) {

                                this.$Message.info('信息正确');
                                this.$router.back(-1);
                            } else {
                                this.$Message.info(res.data.msg);
                            }

                        });
                    } else {
                        this.$Message.error('你有未输入的信息');
                    }
                });
            },
            NO_handleSubmit () {
                this.$router.push({
                    name:"oauth_index"
                });
            },
        }
    };
</script>

<style scoped>

</style>