<template>
    <div style="    margin:85px 0 0 110px ; width: 375px;">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <FormItem label="客户端ID" prop="clientId">
                <Input v-model="formValidate.clientId" placeholder="请输入客户端ID"></Input>
                <span class="tip" style="line-height: 24px;
    color: #999;    margin-left: -3px;"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{brower}}</span>

            </FormItem>
            <FormItem label="权限值" prop="authorities">
                <Input v-model="formValidate.authorities" placeholder="请输入权限值(多个值用逗号隔开)"></Input>
<span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{popTip}}</span>
            </FormItem>
            <FormItem label="权限范围" prop="scope">
                <Input v-model="formValidate.scope" placeholder="请输入权限范围(多个值用逗号隔开)"></Input>

<span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{popTip}}</span>

            </FormItem>
            <FormItem label="授权类型" prop="authorizedGrantTypes">
                <Input v-model="formValidate.authorizedGrantTypes" placeholder="请输入授权类型(多个值用逗号隔开)"></Input>

<span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{popTip}}</span>

            </FormItem>
            <FormItem label="票据有效期" prop="accessTokenValidity" >
                <Input v-model="formValidate.accessTokenValidity" :placeholder="refPopCon"></Input>
<span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{refPopCon}}</span>


            </FormItem>
            <FormItem label="刷新票据有效期" prop="refreshTokenValidity" >
                <Input v-model="formValidate.refreshTokenValidity" :placeholder="PopCon"></Input>

<span class="tip"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{PopCon}}</span>

            </FormItem>
            <FormItem label="访问密钥" prop="clientSecret">
                <Input type="password"  v-model="formValidate.clientSecret" placeholder="请输入密钥"></Input>
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
                brower:"    客户端ID只能为字母、数字、横线下划线",
                refPopCon: '请输入正整数(单位:秒; 默认值:2592000秒, 即30天)',
                PopCon: '请输入正整数(单位:秒; 默认值:43200秒, 即12小时)',
                popTip: '多个值用逗号隔开',
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
                        {required: true, type:"string", pattern: /^[0-9a-zA-Z_-]{1,}$/, message: '客户端ID只能为字母、数字、横线下划线', trigger: 'blur'}
                    ],

                }
            };
        },
        methods: {
            handleSubmit () {
                if(this.formValidate.accessTokenValidity.length==0||this.formValidate.refreshTokenValidity.length ==0){
                    this.sure_p()
                    return;
              }
                if (Number(this.formValidate.accessTokenValidity)>=0&& Number(this.formValidate.refreshTokenValidity)>=0) {
                    this.sure_p()
                } else {
                    if (Number(this.formValidate.accessTokenValidity)<0) {
                        this.$Message.error('票据有效期为正整数(单位:秒; 默认值:2592000秒, 即30天)');
                    } else if (Number(this.formValidate.refreshTokenValidity)<0) {
                        this.$Message.error('刷新票据有效期为正整数(单位:秒; 默认值:43200秒, 即12小时)');

                    } else {
                        this.$Message.error('票据有效期为正整数(单位:秒; 默认值:2592000秒, 即30天)');
                    }
                }
            },
            sure_p(){
                this.$refs.formValidate.validate((valid) => {
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

                                //this.$Message.info('信息正确');
                                this.$router.back(-1);
                            } else if(res.data.code == 400) {
                                this.$Message.info("你输入的信息格式有问题");
                            }else{
                                this.$Message.info(res.data.msg);
                            }
                        });
                    } else {
                        this.$Message.error('你的信息输入有误');
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
.tip{
    float: left;
    color: #999;

}
</style>
