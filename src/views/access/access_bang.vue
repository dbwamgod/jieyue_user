<template>
    <div style="    margin:85px 0 0 110px ;
        width: 351px;">
        <Tree :data="data4" show-checkbox multiple></Tree>
        <Button type="primary" @click="oks">确定</Button>
        <Button @click="ocal">返回</Button>
    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                resIdLists: [],
                resIdList: [],
                data5: [],
                data4: []
            };
        },
        created () {
            this.init();
        },
        methods: {
            ocal () {
                this.$router.back(-1);
            },
            sele (item) {

                return item.map(r => {
                    if (r.hasOwnProperty('children')) {
                            return {
                                checked: r.checked||false,
                                id: r.id,
                                children: this.sele(r.children)
                        }
                    } else {
                        return {
                            checked: r.checked||false,
                            id: r.id
                        };
                    }
                });
            },
            oks () {
                this.resIdLists = this.sele(this.data4);
                this.resIdLists.forEach((item, index) => {
                    let result = item.children.filter((r, index) => {
                        let resFind
                        if(r.children){
                            resFind =r.children.filter(res=>{
                                return res.checked===true
                            })
                        }else{
                            if(r.checked==true){
                                this.resIdList.push(r.id)
                            }

                        }

                        if(typeof resFind==="object"){
                            resFind.forEach(item => {
                                this.resIdList.push(item.id);
                                this.resIdList.push(r.id)
                            });
                        }else{

                        }

                        return r.checked === true;
                    });
                });
                let set=new Set(this.resIdList)

                this.resIdList=[]
                set._c.forEach(r=>{

                    this.resIdList.push(r)
                })


                this.$axios({
                    method: 'post',
                    url: api.role_bound(),
                    data: {
                        resIdList: this.resIdList,
                        roleId:JSON.parse(this.$route.query.id) ,
                        userId: Cookies.get('user_userId')
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    this.resIdList=[]
                    if (res.data.code == 200) {
                        this.$Message.info('已绑定');

                        this.$router.back(-1);
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            init () {
                this.$axios({
                    method: 'get',
                    url: api.role_bounds(JSON.parse(this.$route.query.id)),
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {

                        this.data4 = this.CascaderIsName(res.data.data);

                    }
                });
            },
            CascaderIsName (item) {
                return item.map(r => {
                    if (r.hasOwnProperty('voList')) {
                        return {
                            title: r.tenantName || r.resourceName,
                            id: r.resourceId || r.tenantId,
                            expand: true,
                            children: this.CascaderIsName(r.voList)
                        };
                    } else if (r.hasOwnProperty('child')) {
                        if (r.child !== null) {
                            return {
                                title: r.resourceName || r.tenantName,
                                id: r.resourceId || r.tenantId,
                                checked: r.bound,
                                expand: true,
                                children: this.CascaderIsName(r.child)
                            };
                        } else {
                            return {
                                title: r.tenantName || r.resourceName,
                                id: r.resourceId || r.tenantId,
                                checked: r.bound,
                                expand: true,
                            };
                        }
                    } else {
                        return {
                            title: r.tenantName || r.resourceName,
                            id: r.resourceId || r.tenantId,
                            checked: r.bound,
                            expand: true,
                            // children: this.CascaderIsName(r.voList)
                        };
                    }

                });
            }
        }

    };
</script>


<style scoped>

</style>