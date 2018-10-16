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
            <MenuItem name="1-1" style="padding: 0" v-if="menuDisplay.origin">
                <router-link tag="li" to="/organization-management-system"
                             style="width: 100%;height: 50px;text-align: left;line-height: 50px;">
                    <Icon type="pie-graph" style='margin: 0 8px 0 48px;' :size='18' color="#fff"></Icon>
                    组织机构管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-2" style="padding: 0" v-if="menuDisplay.tenant">
                <router-link tag="li" to="/tenant/index"
                             style="width: 100%;height: 50px;text-align: left;line-height: 50px;">
                    <Icon type="android-contacts" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    租户管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-3" style="padding: 0" v-if="menuDisplay.resourse">
                <router-link tag="li" to="/resource/index" style="    width: 100%;
    height: 50px;
    text-align: left;
    line-height: 50px;">
                    <Icon type="social-buffer" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    资源管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-4" style="padding: 0" v-if="menuDisplay.user">
                <router-link tag="li" to="/access-test/index" style="    width: 100%;
    height: 50px;
    text-align: left;
    line-height: 50px;">
                    <Icon type="android-person" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    用户管理
                </router-link>
            </MenuItem>
            <MenuItem name="1-5" style="padding: 0" v-if="menuDisplay.role">
                <router-link tag="li" to="/access-management-system/index" style="    width: 100%;
    height: 50px;
    text-align: left;
    line-height: 50px;">
                    <Icon type="ribbon-b" :size='18' style='margin: 0 8px 0 48px;' color="#fff"></Icon>
                    角色管理
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
                    origin: false,
                    tenant: false,
                    resourse: false,
                    user: false,
                    role: false
                },
                menuListDisplay: [],
                activeName: '1-1',

            };
        },
        name: 'sidebarMenu',
        watch: {
            '$route' (to, form) {
                const pathNameObj = {
                    home_index: '1-1', tenant_index: '1-2', resource_index: '1-3',
                    accesstest_index: '1-4', access_index: '1-5'
                };
                if (pathNameObj[to.name]) {
                    this.activeName = pathNameObj[to.name];
                    sessionStorage.setItem('user_pages', pathNameObj[to.name]);
                } else {
                }
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
                if (localQ.length !== 0) {
                    localQ.forEach(r => {
                        this.menuListDisplay.push(r.resourceName);
                    });

                    for (let i = 0; i < localQ.length; i++) {
                        if (localQ[i + 1]) {
                            if (localQ[i].resourceCode == '03' || localQ[i + 1].resourceCode == '03') {
                                this.activeName = '1-1';
                                break;
                            }
                        }
                        if (localQ[i].resourceCode == '01') {
                            this.activeName = '1-2';
                            break;
                        }
                        else if (localQ[i].resourceCode == '08') {
                            this.activeName = '1-3';
                            break;
                        }
                        else if (localQ[i].resourceCode == '13') {
                            this.activeName = '1-4';
                            break;
                        }
                        else if (localQ[i].resourceCode == '22') {
                            this.activeName = '1-5';
                            break;
                        }
                    }
                    for (var variable of this.menuListDisplay) {
                        if (variable == '角色管理') {
                            this.menuDisplay.role = true;
                        } else if (variable == '用户管理') {
                            this.menuDisplay.user = true;
                        } else if (variable == '资源管理') {
                            this.menuDisplay.resourse = true;
                        } else if (variable == '租户管理') {
                            this.menuDisplay.tenant = true;
                        } else if (variable == '组织机构管理') {
                            this.menuDisplay.origin = true;
                        }
                    }
                }
            if (sessionStorage.getItem('user_pages')) {
                this.activeName = sessionStorage.getItem('user_pages') || '1-1';
            }
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

