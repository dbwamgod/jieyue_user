<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <scroll-bar ref="scrollBar">
                <shrinkable-menu
                        :shrink="shrink"
                        @on-change="handleSubmenuChange"
                        :theme="menuTheme"
                        :before-push="beforePush"
                        :open-names="openedSubmenuArr"
                        :menu-list="menuList">
                    <div slot="top" class="logo-con">
                        <!--  <img v-show="!shrink"  src="../images/logo.jpg" key="max-logo" />-->
                        <h2 style="color:#fff;">用户管理</h2>

                    </div>
                </shrinkable-menu>
            </scroll-bar>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                            @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>

                    <!--<lock-screen style="    margin-right: 26px;"></lock-screen>-->
                    <!-- <message-tip v-model="mesCount"></message-tip> -->
                    <!--<theme-switch></theme-switch>-->

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <!-- <DropdownItem name="ownSpace">个人中心</DropdownItem>-->
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <!-- <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div> -->
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page" style="margin:0"  v-if="bock">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import scrollBar from '@/views/my-components/scroll-bar/vue-scroller-bars';
    import userT from '@/api/index';

    export default {
        provide () {
            return {
                reload: this.reload
            };
        },
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            scrollBar
        },
        data () {
            return {
                codeCompare:{ORG:"tenant_index",TENANT:"home_index",RES:"resource_index",USER:"accesstest_index",ROLE:"access_index",THREE_SYSTEM:"oauth_index"},
                bock: true,
                shrink: false,
                userName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr
            };
        },
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            },
        },
        methods: {
            reload () {
                this.bock = false;
                this.$nextTick(function () {
                    this.bock = true;
                });
            },
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);

                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user_user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
            },
            toggleClick () {

                // this.$router.push({name:`${ Cookies.get("defaultHome")}`})
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');

                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({
                        name: 'login'
                    });
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {

            },

            // scrollBarResize () {
            //     this.$refs.scrollBar.resize();
            // }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            },
            /*   openedSubmenuArr () {
                   setTimeout(() => {
                       this.scrollBarResize();
                   }, 300);
               }*/
        },
        mounted () {
            this.init();
            window.addEventListener('resize', this.scrollBarResize);
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

                    // console.log(JSON.parse(localStorage.getItem('Jurisdiction')));
                    JSON.parse(localStorage.getItem('Jurisdiction')).map((r,i)=>{
                        if(r.resourceCode=="TENANT"&&CodeOrg !== 'ORG'){
                            Cookies.set('defaultHome', 'tenant_index');
                            this.$router.push({
                                name: 'tenant_index'
                            });
                        }else {

                            if(i=0){
                                console.log(this.codeCompare[r.resourceCode]);
                             Cookies.set('defaultHome', this.codeCompare[r.resourceCode]);
                             this.$router.push({
                                 name:  Cookies.get('defaultHome')
                             });
                         }

                        }

                    })
                 /*   if (Code == 'TENANT' || CodeOrg == 'ORG') {
                        Cookies.set('defaultHome', 'home_index');
                        this.$router.push({
                            name: 'home_index'
                        });
                    }
                    if (Code == 'TENANT' && CodeOrg != 'ORG') {
                        Cookies.set('defaultHome', 'tenant_index');
                        this.$router.push({
                            name: 'tenant_index'
                        });
                    }
                    else if (Code == 'RES') {
                        Cookies.set('defaultHome', 'resource_index');
                        this.$router.push({
                            name: 'resource_index'
                        });
                    }
                    else if (Code == 'USER') {
                        Cookies.set('defaultHome', 'accesstest_index');
                        this.$router.push({
                            name: 'accesstest_index'
                        });
                    }
                    else if (Code == 'ROLE') {
                        Cookies.set('defaultHome', 'access_index');
                        this.$router.push({
                            name: 'access_index'
                        });
                    }
                    else if (Code == 'THREE_SYSTEM') {
                        Cookies.set('defaultHome', 'oauth_index');
                        this.$router.push({
                            name: 'oauth_index'
                        });
                    }*/
                }
            }
            Array.prototype.remove = function (val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        },
        dispatch () {
            window.removeEventListener('resize', this.scrollBarResize);
        }
    };
</script>
