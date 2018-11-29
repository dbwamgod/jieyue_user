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
                <router-link class="router-to" tag="li" :to="dynamicMenu.codeName[code[index]]">
                    <Icon :type="dynamicMenu.iconMenu[code[index]]" class="router-text" :size='18' color="#fff"></Icon>
                        {{item}}
                </router-link>
            </MenuItem>
        </Submenu>
    </Menu>
</template>

<script>

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
                        ORG: "md-pie",
                        TENANT: "md-contacts",
                        RES: "md-globe",
                        USER: "md-person",
                        ROLE: "md-ribbon",
                        THREE_SYSTEM: "ios-people"
                    },
                    codeName:{
                        ORG: "/organization-management-system",
                        TENANT: "/tenant/index",
                        RES: "/resource/index",
                        USER: "/access-test/index",
                        ROLE: "/access-management-system/index",
                        THREE_SYSTEM: "/oauth_client/index"
                    },
                },
                code:[],

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
                };
                pathNameObj[to.name]?this.activeName = pathNameObj[to.name]:'';
               pathNameObj[to.name] && sessionStorage.setItem('user_pages', pathNameObj[to.name]);
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

