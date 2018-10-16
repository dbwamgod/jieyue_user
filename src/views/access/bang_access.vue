<template>
    <div style="    margin:85px 0 0 110px ;
        width: 351px;">
        <Tree :data="data3" show-checkbox></Tree>
        <Button type="primary" style="margin: 10px 10px 0 0" @click="oks">确定</Button>
        <Button @click="ocal" style="margin: 10px 10px 0 0" >返回</Button>

    </div>
</template>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';
/*
 *   绑定角色
 *  */
    export default {
        data () {
            return {
                roleIdList: [],
                data3: [
                    {title: '银河平台'}
                ]
            };
        },
        created () {

            this.init();
        },

        methods: {
            init () {
                this.$axios({
                    method: 'post',
                    url: api.userAccess(),
                    data: {
                        currentUserId: Cookies.get('user_userId'),
                        userId: JSON.parse(this.$route.query.data)
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let result = res.data.data.map((item, index) => {
                            return {
                                title: item.roleName || '',
                                id: item.roleId || '',
                                checked: item.bound,
                            };
                        });
                        this.data3 = result;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            oks () {
                this.data3.map(item => {
                    if (item.checked) {
                        this.roleIdList.push(item.id);
                    }
                });
                this.$axios({
                    method: 'post',
                    url: api.user_bang(),
                    data: {
                        currentUserId: Cookies.get('user_userId'),
                        roleIdList: this.roleIdList,
                        userId:JSON.parse(this.$route.query.data)
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$Message.info("已绑定")
                        this.roleIdList=[]
                        this.$router.back(-1);
                    }
                });
            },
            ocal () {
                this.$router.back(-1);
            }
        }
    };
</script>