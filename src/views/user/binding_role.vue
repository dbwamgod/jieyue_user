<template>
    <div>
        <div style="    padding:50px 0 0 80px ;background:#fff; position: relative; overflow: hidden;">
            <!--<Tree :data="data3" show-checkbox></Tree>-->

            <Menu @on-select="menuSelect" :open-names="['1']"  v-for="(item,index) in data3" :key="index" style="float: left;width: 300px;">
                <Submenu name="1" style="width: 100%;">
                    <template slot="title">
                        <span style="font-size: 15px">{{item.tenantName}}</span>
                    </template>
                    <CheckboxGroup style="margin-left: 30px; " v-model="checkAllGroup" @on-change="checkAllGroupChange"
                                   v-for="(then,i) in item.voList" :key="i">
                        <Checkbox
                                style="display: block;font-size: 14px;    text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
                                :label="then.roleId">{{then.roleName}}
                        </Checkbox>

                    </CheckboxGroup>
                </Submenu>
            </Menu>


        </div>
        <div style="padding-left:80px; box-sizing: border-box;">
            <Button type="primary" style="margin: 10px 10px 0 0" @click="oks">确定</Button>
            <Button @click="ocal" style="margin: 10px 10px 0 0">返回</Button>
        </div>

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
                checkAllGroup: [],
                roleIdList: [],
                data3: []
            };
        },
        created () {
            this.init();
        },
        methods: {
            checkAllGroupChange (a) {

            },
            menuSelect (name) {
                this.$store.commit('addOpenSubmenu', name);
            },
            changeMenu (active) {

                this.$emit('on-change', active);
            },
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
                        this.data3 = res.data.data;
                        let result = [];
                        res.data.data.map((item, index) => {
                            item.voList.map(r => {
                                if (r.bound === true) {
                                    this.checkAllGroup.push(r.roleId);
                                }
                            });
                        });
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            oks () {

                this.$axios({
                    method: 'post',
                    url: api.user_bang(),
                    data: {
                        currentUserId: Cookies.get('user_userId'),
                        roleIdList: this.checkAllGroup,
                        userId: JSON.parse(this.$route.query.data)
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$Message.info('已绑定');
                        this.roleIdList = [];
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