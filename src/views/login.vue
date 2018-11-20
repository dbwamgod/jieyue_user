<style lang="less">
    @import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="md-log-in"></Icon>
                    欢迎登录
                </p>
                <!--<Tree :data="data2" show-checkbox @on-check-change="checkChange" ref="treeT"></Tree>-->
                <div class="form-con">
                    <Form id="form_id" ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="md-person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="md-lock"></Icon>
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
        inject: ['out'],
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

                    ORG: 'org_index',
                    TENANT: 'tenant_index',

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

                                            if (res.data.data.length) {
                                                Cookies.set('login_info', '1');//做首次登录记录
                                                localStorage.setItem('Jurisdiction', JSON.stringify(res.data.data));
                                                let set = new Set(JSON.parse(localStorage.getItem('Jurisdiction')));
                                                let resource = [...set];
                                                resource.forEach(r => {
                                                    r.child && r.child.length && r.child.forEach(res => {
                                                        this.disNay.push(res);
                                                    });
                                                });
                                                let resourceCodes = resource.map(r => r.resourceCode);
                                                localStorage.setItem('child', JSON.stringify(this.disNay));
                                                for (var code in  resourceCodes) {
                                                    Cookies.set('defaultHome', this.codeCompare[resourceCodes[code]]);
                                                    this.$router.push({
                                                        name: this.codeCompare[resourceCodes[code]]
                                                    });
                                                    return;
                                                }
                                            } else {
                                                const title = '登录错误';
                                                this.out();
                                                this.$Modal.error({
                                                    title: title,
                                                    content: '您未开通系统权限, 请联系管理员',
                                                });
                                            }
                                        } else {
                                            this.msg = res.data.msg;
                                            const title = '资源错误';
                                            this.out();
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

            },
            /* checkChange (e) {
                 let checkNodes = this.$refs.treeT.getCheckedAndIndeterminateNodes();

                 checkNodes.map(r => {
                     if (r.id == e.parentId) {
                         r.children.map(t => {

                         });
                     }
                 });
             }*/
        },

    };
</script>

<style scoped>
    .ivu-modal {
        top: 200px;
    }
</style>
