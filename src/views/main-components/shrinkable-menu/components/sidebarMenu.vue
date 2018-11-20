<style lang="less">
    @import "../styles/menu.less";
</style>

<template>
    <Menu ref="sideMenu" :active-name="activeName" :open-names="['1']" :theme="menuTheme" width="auto"
          @on-select="menuSelect">


        <Submenu name="1">
            <template slot="title">
                <Icon type="ios-analytics"></Icon>
                <span>系统配置</span>
            </template>

            <MenuItem :name="menuActiveName[index]" class="menu-title-flag"  v-if="menuDisplay[code[index]]" v-for="(item,index) in dynamicMenu.textMenu" :key="index">

                <router-link class="router-to" tag="li" :to="codeName[code[index]]">
                    <Icon :type="iconType[code[index]]" class="router-text" :size='18' color="#fff"></Icon>
                        {{item}}
                </router-link>
            </MenuItem>
         <!--   <MenuItem name="1-2"  class="menu-title-flag" v-if="menuDisplay.TENANT">
                <router-link class="router-to" tag="li" to="/tenant/index">
                    <Icon type="md-contacts" :size='18'  class="router-text" color="#fff"></Icon>
                    租户管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-3"  class="menu-title-flag" v-if="menuDisplay.RES">
                <router-link class="router-to" tag="li" to="/resource/index">
                    <Icon type="md-globe" :size='18' class="router-text" color="#fff"></Icon>
                    资源管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-4"  class="menu-title-flag" v-if="menuDisplay.USER">
                <router-link class="router-to" tag="li" to="/access-test/index" >
                    <Icon type="md-person" :size='18' class="router-text" color="#fff"></Icon>
                    用户管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-5"  class="menu-title-flag" v-if="menuDisplay.ROLE">
                <router-link class="router-to" tag="li" to="/access-management-system/index" >
                    <Icon type="md-ribbon" :size='18' class="router-text" color="#fff"></Icon>
                    角色管理
                </router-link>

            </MenuItem>
            <MenuItem name="1-6"  class="menu-title-flag" v-if="menuDisplay.THREE_SYSTEM">
                <router-link class="router-to" tag="li" to="/oauth_client/index" >

                    <Icon type="ios-people" :size='18' class="router-text" color="#fff"></Icon>
                    三方系统
                </router-link>

            </MenuItem>-->
        </Submenu>
    </Menu>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                menuDisplay: {
                    ORG: false,
                    TENANT: false,
                    RES: false,
                    USER: false,
                    ROLE: false,
                    THREE_SYSTEM: false
              },
                activeName: '',
                menuActiveName: ['1-1', '1-2','1-3', '1-4','1-5','1-6'],
                pathNameObj:{},
                dynamicMenu:{
                    textMenu:[],
                    iconMenu:{
                    },
                },
                code:[],
                codeName:{
                    ORG: "/organization-management-system",
                    TENANT: "/tenant/index",
                    RES: "/resource/index",
                    USER: "/access-test/index",
                    ROLE: "/access-management-system/index",
                    THREE_SYSTEM: "/oauth_client/index"
                },
                iconType:{
                    ORG: "md-pie",
                    TENANT: "md-contacts",
                    RES: "md-globe",
                    USER: "md-person",
                    ROLE: "md-ribbon",
                    THREE_SYSTEM: "ios-people"
                }
            };
        },
        name: 'sidebarMenu',
        watch: {
            '$route' (to, form) {
               const pathNameObj= {
                   org_index: '1-2',
                   tenant_index: '1-1',
                   resource_index: '1-3',
                   accesstest_index: '1-4',
                   access_index: '1-5',
                   oauth_index: '1-6',
                }
                this.pathNameObj[to.name]?this.activeName =this. pathNameObj[to.name]:''
               this.pathNameObj[to.name] && sessionStorage.setItem('user_pages', this.pathNameObj[to.name]);
            }
        },
        props: {
            menuList: Array,
            iconSize: Number,
            menuTheme: {
                type: String,
                default: 'dark'
            },
            openNames: {
                type: Array
            },

        },
        created () {
            let localQ = JSON.parse(localStorage.getItem('Jurisdiction'));
            localQ && localQ.length && localQ.forEach((r,i) => {
                let index=0
                this.code.push(r.resourceCode);
                this.dynamicMenu.textMenu.push(r.resourceName)
                this.menuDisplay[r.resourceCode]=true;
                this.pathNameObj[r.resourceCode]=`1-${index+1}`
                this.activeName = this.pathNameObj[r.resourceCode];
            });
            this.activeName = sessionStorage.getItem('user_pages') || '1-1';

        },
        methods: {
            menuSelect (name) {
                sessionStorage.setItem('user_pages', name);
                this.$store.commit('addOpenSubmenu', name);
            }
        },
        updated () {
            this.$nextTick(() => {
                if (this.$refs.sideMenu) {
                    this.$refs.sideMenu.updateOpened();
                }
            });
        }
    };
</script>
<style>
    router-link {
        color: white;
    }
</style>

