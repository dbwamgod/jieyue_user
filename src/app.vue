<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {

        data () {
            return {
                bock: true,
                theme: this.$store.state.app.themeColor
            };
        },
        created () {

//本地权限校验没有存储后 会自动跳到登录页
            if (!JSON.parse(localStorage.getItem('Jurisdiction'))) {
                this.$store.commit('logout', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$router.push({
                    name: 'login'
                });
            }
            //判断已登录后重新加载页面而导致的权限bug
            if (!sessionStorage.getItem('user_pages')) {
                if (localStorage.getItem('Jurisdiction')) {
                    let Code = JSON.parse(localStorage.getItem('Jurisdiction'))[0].resourceCode;
                    let CodeOrg = 0;
                    if (JSON.parse(localStorage.getItem('Jurisdiction'))[1]) {
                        CodeOrg = JSON.parse(localStorage.getItem('Jurisdiction'))[1].resourceCode;
                    }

                    if (Code == '01' || CodeOrg == '03') {
                        Cookies.set('defaultHome', 'home_index');
                        this.$router.push({
                            name: 'home_index'
                        });
                    }
                    if (Code == '01' && CodeOrg !== '03') {
                        Cookies.set('defaultHome', 'tenant_index');
                        this.$router.push({
                            name: 'tenant_index'
                        });
                    }
                    else if (Code == '08') {
                        Cookies.set('defaultHome', 'resource_index');
                        this.$router.push({
                            name: 'resource_index'
                        });
                    }
                    else if (Code == '13') {
                        Cookies.set('defaultHome', 'accesstest_index');
                        this.$router.push({
                            name: 'accesstest_index'
                        });
                    }
                    else if (Code == '22') {
                        Cookies.set('defaultHome', 'access_index');
                        this.$router.push({
                            name: 'access_index'
                        });
                    }
                }
            }
            Array.prototype.remove = function (val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
        },
        mounted () {
        },

        methods: {

        }
    };
</script>

<style>
    html,
    body {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }

    .app-main {
        width: 100%;
        height: 100%;
    }
</style>
