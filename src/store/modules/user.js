import Cookies from 'js-cookie';

const user = {

    mutations: {
        logout (state, vm) {
            Cookies.remove('user_user');
            Cookies.remove('del');
            Cookies.remove('user_password');
            Cookies.remove('user_token');
            Cookies.remove('user_userId');
            Cookies.remove('user_access');
            sessionStorage.removeItem('user_pages');
            Cookies.remove('index');
            Cookies.remove('flag');
            Cookies.remove('defaultHome');
            Cookies.remove('res_index');
            localStorage.removeItem('Jurisdiction');
            localStorage.removeItem('child');

            state.binding="";
            state.bindingRes="";
            state.bindRes="";
            state.bindRole="";
            state.resSearchFlag="";
            state.orgSearchFlag="";
            state.lostSearchFlag="";
            state.notData="";


        /*        this.$store.commit("bindingChange");
                this.$store.commit("bindingChangeRes");
                this.$store.commit("bindRes");
                this.$store.commit("bindRole");
                this.$store.commit("resSearch");
                this.$store.commit("orgSearch");
                this.$store.commit("lostSearch");
                this.$store.commit("delData");*/

            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        setUser (state, {user_name, user_token}) {
            // 在这里把用户名和token保存起来
            localStorage.setItem('currentUser_name', user_name);
            localStorage.setItem('currentUser_token', user_token);
        },

    }
};

export default user;
