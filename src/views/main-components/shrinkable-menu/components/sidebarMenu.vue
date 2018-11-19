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
            <MenuItem name="1-1" style="padding: 0" v-if="menuDisplay.ORG">
                <router-link tag="li" to="/organization-management-system"
                             style="width: 100%;height: 50px;text-align: left;line-height: 50px;">
                    <Icon type="md-pie" style='margin: 0 8px 0 48px;' :size='18' color="#fff"></Icon>
                    组织机构管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-2" style="padding: 0" v-if="menuDisplay.TENANT">
                <router-link tag="li" to="/tenant/index"
                             style="width: 100%;height: 50px;text-align: left;line-height: 50px;">
                    <Icon type="md-contacts" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    租户管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-3" style="padding: 0" v-if="menuDisplay.RES">
                <router-link tag="li" to="/resource/index" style="    width: 100%;
    height: 50px;
    text-align: left;
    line-height: 50px;">
                    <Icon type="md-globe" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    资源管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-4" style="padding: 0" v-if="menuDisplay.USER">
                <router-link tag="li" to="/access-test/index" style="    width: 100%;
    height: 50px;
    text-align: left;
    line-height: 50px;">
                    <Icon type="md-person" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    用户管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-5" style="padding: 0" v-if="menuDisplay.ROLE">
                <router-link tag="li" to="/access-management-system/index" style="    width: 100%;
    height: 50px;
    text-align: left;
    line-height: 50px;">
                    <Icon type="md-ribbon" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    角色管理
                </router-link>

            </MenuItem>
            <MenuItem name="1-6" style="padding: 0" v-if="menuDisplay.THREE_SYSTEM">
                <router-link tag="li" to="/oauth_client/index" style="    width: 100%;
    height: 50px;
    text-align: left;
    line-height: 50px;">

                    <Icon type="ios-people" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    三方系统
                </router-link>

            </MenuItem>
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
                activeName: '1-1',
                pathNameObj: {
                    ORG: '1-1',
                    TENANT: '1-2',
                    RES: '1-3',
                    USER: '1-4',
                    ROLE: '1-5',
                    THREE_SYSTEM: '1-6',
                }
            };
        },
        name: 'sidebarMenu',
        watch: {
            '$route' (to, form) {
               const pathNameObj= {
                   org_index: '1-1',
                   tenant_index: '1-2',
                   resource_index: '1-3',
                   accesstest_index: '1-4',
                   access_index: '1-5',
                   oauth_index: '1-6',
                }
                 pathNameObj[to.name]?this.activeName = pathNameObj[to.name]:''
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
            }
        },
        created () {
            let localQ = JSON.parse(localStorage.getItem('Jurisdiction'));
            localQ && localQ.length && localQ.forEach(r => {
                this.menuDisplay[r.resourceCode]=true;
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

