<style lang="less">
    @import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form id="form_id" ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import md5 from 'js-md5';
    import api from '@/api';

    export default {

        data () {
            return {
                msg: '',
                form: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                },
                codeCompare: {
                    ORG: 'tenant_index',
                    TENANT: 'home_index',
                    RES: 'resource_index',
                    USER: 'accesstest_index',
                    ROLE: 'access_index',
                    THREE_SYSTEM: 'oauth_index'
                },
                disNay: []
            };
        },
        methods: {

            handleSubmit () {
                let _self = this;
                this.$refs.loginForm.validate(valid => {
                    if (valid) {//登陆接口
                        let fd = new FormData();
                        fd.append('password', this.form.password);
                        fd.append('username', this.form.userName);
                        fd.append('client_id', 'browser');
                        fd.append('client_secret', 'abc');
                        fd.append('grant_type', 'password');
                        this.$axios({
                            method: 'post',
                            url: api.login(),
                            data: fd,
                            headers: {
                                'content-Type': 'application/x-www-form-urlencoded',
                            }
                        }).then(res => {
                            if (res.status === 200) {
                                // Cookies.sets({"user_user":this.form.userName,"user_password":md5(this.form.password),"user_access":1,"user_token":res.data.access_token})
                                Cookies.set('user_user', this.form.userName);
                                Cookies.set('user_password', md5(this.form.password));
                                Cookies.set('user_access', 1);
                                Cookies.set('user_token', res.data.access_token);
                                this.$store.commit('addOpenSubmenu', '2-1');
                                this.$store.commit('setAvator', require('@/images/u=3448484253,3685836170&fm=27&gp=0.jpg'));
                                this.$axios({
                                    method: 'get',
                                    url: api.userId(),
                                    headers: {
                                        'content-Type': 'application/x-www-form-urlencoded',
                                    },
                                }).then(res => {
                                    Cookies.set('user_userId', res.data.principal.id);
                                    this.$axios({
                                        method: 'post',
                                        url: api.Resource_permissions(),
                                        data: {
                                            tenantCode: 'UNIFY_USER_PLATFORM',
                                            userId: Cookies.get('user_userId')
                                        }
                                    }).then(res => {

                                        if (res.data.code == 200) {
                                            if(res.data.data.length){
                                                let dataLen = [];
                                                res.data.data.map((r, i) => {
                                                    dataLen.push(r);
                                                });
                                                localStorage.setItem('Jurisdiction', JSON.stringify(dataLen));

                                                let set = new Set(JSON.parse(localStorage.getItem('Jurisdiction')));
                                                let resource = [...set];
                                                resource.forEach(r => {
                                                    if (r.child) {
                                                        r.child.forEach(res => {
                                                            this.disNay.push(res);
                                                        });
                                                    }
                                                });

                                                let resourceCodes = resource.map(r => r.resourceCode);
                                                localStorage.setItem('child', JSON.stringify(this.disNay));
                                                if (resourceCodes.includes('ORG')) {
                                                    Cookies.set('defaultHome', 'home_index');
                                                    this.$router.push({
                                                        name: 'home_index'
                                                    });

                                                    return;
                                                } else {
                                                    for (var code in  resourceCodes) {
                                                        // console.log(resourceCodes);
                                                        if (resourceCodes.includes('TENANT')) {

                                                            Cookies.set('defaultHome', this.codeCompare[resourceCodes[code]]);
                                                            this.$router.push({
                                                                name: this.codeCompare[resourceCodes[code]]
                                                            });
                                                            return;
                                                        }

                                                        Cookies.set('defaultHome', this.codeCompare[resourceCodes[code]]);
                                                        this.$router.push({
                                                            name: this.codeCompare[resourceCodes[code]]
                                                        });
                                                        return;
                                                    }
                                                }
                                            }else{
                                                const title = '登录错误';
                                                Cookies.remove('user_user');
                                                Cookies.remove('user_password');
                                                Cookies.remove('user_access');
                                                Cookies.remove('user_token');
                                                Cookies.remove('user_userId');
                                                this.$Modal.error({
                                                    title: title,
                                                    content: '您未开通系统权限, 请联系管理员',
                                                });
                                            }


                                            /*    for (let i = 0; i < resource.length; i++) {

                                                    if(resource[i + 1]){
                                                        if (resource[i].resourceCode == 'TENANT' || resource[i + 1].resourceCode == 'TENANT') {
                                                            Cookies.set('defaultHome', 'home_index');
                                                            this.$router.push({
                                                                name: 'home_index'
                                                            });
                                                            break;
                                                        }
                                                    }
                                                    if (resource[i].resourceCode == 'ORG') {
                                                        Cookies.set('defaultHome', 'tenant_index');
                                                        this.$router.push({
                                                            name: 'tenant_index'
                                                        });
                                                        break;
                                                    }
                                                    if (resource[i].resourceCode == 'RES') {
                                                        Cookies.set('defaultHome', 'resource_index');
                                                        this.$router.push({
                                                            name: 'resource_index'
                                                        });
                                                        break;
                                                    }
                                                    if (resource[i].resourceCode == 'USER') {
                                                        Cookies.set('defaultHome', 'accesstest_index');
                                                        this.$router.push({
                                                            name: 'accesstest_index'
                                                        });
                                                        break;
                                                    }
                                                    if (resource[i].resourceCode == 'ROLE') {
                                                        Cookies.set('defaultHome', 'access_index');
                                                        this.$router.push({
                                                            name: 'access_index'
                                                        });
                                                        break;
                                                    }
                                                    if (resource[i].resourceCode == 'THREE_SYSTEM') {
                                                        Cookies.set('defaultHome', 'oauth_index');
                                                        this.$router.push({
                                                            name: 'oauth_index'
                                                        });
                                                        break;
                                                    }
                                                }*/



                                        } else {
                                            this.msg = res.data.msg;
                                            const title = '资源错误';
                                            Cookies.remove('user_user');
                                            Cookies.remove('user_password');
                                            Cookies.remove('user_access');
                                            Cookies.remove('user_token');
                                            Cookies.remove('user_userId');
                                            this.$Modal.error({
                                                title: title,
                                                content: res.data.msg,
                                            });
                                        }
                                    });
                                });
                                //跳转到首页
                            }
                        }).catch(res => {
                            this.$Message.error('您输入的账号密码错误!');
                        });
                    }

                });
            }
        }
    };
</script>

<style scoped>
    .ivu-modal {
        top: 200px;
    }
</style>
