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
                    <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
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
                }
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
                                        method: 'get',
                                        url: api.Resource_permissions()
                                    }).then(res => {
                                        if (res.data.code == 200) {
                                            for (var i = 0; i < res.data.data.length; i++) {
                                                var dataLen = res.data.data;
                                                for (var j = 0; j < dataLen.length - i - 1; j++) {
                                                    if (dataLen[j].resourceCode > dataLen[j + 1].resourceCode) {
                                                        var temp = dataLen[j];
                                                        dataLen[j] = dataLen[j + 1];
                                                        dataLen[j + 1] = temp;
                                                    }
                                                }
                                            }
                                            localStorage.setItem('Jurisdiction', JSON.stringify(dataLen));
                                            let disNay = [];
                                            let set = new Set(JSON.parse(localStorage.getItem('Jurisdiction')));
                                            let resource = [...set];
                                            resource.forEach(r => {
                                                if (r.child) {
                                                    r.child.forEach(r => {
                                                        disNay.push(r);
                                                    });
                                                }
                                            });
                                            for (let i = 0; i < resource.length; i++) {

                                                if(resource[i + 1]){
                                                    if (resource[i].resourceCode == '03' || resource[i + 1].resourceCode == '03') {
                                                        Cookies.set('defaultHome', 'home_index');
                                                        this.$router.push({
                                                            name: 'home_index'
                                                        });
                                                        break;
                                                    }
                                                }
                                                  if (resource[i].resourceCode == '01') {
                                                    Cookies.set('defaultHome', 'tenant_index');
                                                    this.$router.push({
                                                        name: 'tenant_index'
                                                    });
                                                    break;
                                                }
                                                 if (resource[i].resourceCode == '08') {
                                                    Cookies.set('defaultHome', 'resource_index');
                                                    this.$router.push({
                                                        name: 'resource_index'
                                                    });
                                                    break;
                                                }
                                                if (resource[i].resourceCode == '13') {
                                                    Cookies.set('defaultHome', 'accesstest_index');
                                                    this.$router.push({
                                                        name: 'accesstest_index'
                                                    });
                                                    break;
                                                }
                                                if (resource[i].resourceCode == '22') {
                                                    Cookies.set('defaultHome', 'access_index');
                                                    this.$router.push({
                                                        name: 'access_index'
                                                    });
                                                    break;
                                                }
                                            }

                                            localStorage.setItem('child', JSON.stringify(disNay));
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
