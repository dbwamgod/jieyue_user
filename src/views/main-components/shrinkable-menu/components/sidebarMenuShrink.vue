<template>
    <div>
        <template>
            <div class="drop-box" key="grala">
                <Dropdown v-if="menuDisplay.org" transfer placement="right-start" :key="1" @on-click="changeMenu">
                    <Button class="downBtn"  type="text"  ghost>
                        <Icon type="md-pie" :size='20' class="icon-color"></Icon>
                    </Button>
                    <DropdownMenu class="drop-menu" slot="list">
                        <DropdownItem name="home_index" key="1-1"><span class="drop-info">组织机构管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.ten" transfer placement="right-start" :key="2" @on-click="changeMenu">
                    <Button class="downBtn" type="text" ghost >
                        <Icon type="md-contacts" :size='20' class="icon-color"></Icon>
                    </Button>
                    <DropdownMenu class="drop-menu" slot="list">
                        <DropdownItem name="tenant_index" key="2-1"><span class="drop-info">租户管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.res" transfer placement="right-start" :key="3" @on-click="changeMenu">
                    <Button class="downBtn" type="text" ghost>
                        <Icon type="md-globe" :size='20' class="icon-color"></Icon>
                    </Button>
                    <DropdownMenu class="drop-menu" slot="list">
                        <DropdownItem name="resource_index" key="3-1"><span class="drop-info">资源管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.use" transfer placement="right-start" :key="4" @on-click="changeMenu">
                    <Button class="downBtn" type="text" ghost>
                        <Icon type="md-person" :size='20' class="icon-color"></Icon>

                    </Button>
                    <DropdownMenu class="drop-menu" slot="list">
                        <DropdownItem name="accesstest_index" key="4-1"><span class="drop-info">用户管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.rol" transfer placement="right-start" :key="5" @on-click="changeMenu">
                    <Button class="downBtn" type="text" ghost>
                        <Icon type="md-ribbon" :size='20' class="icon-color"></Icon>
                    </Button>
                    <DropdownMenu class="drop-menu" slot="list">
                        <DropdownItem name="access_index" key="5-1"><span class="drop-info">角色管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.thr" transfer placement="right-start" :key="6" @on-click="changeMenu">
                    <Button class="downBtn" type="text" ghost>
                        <Icon type="ios-people" :size='20' class="icon-color"></Icon>
                    </Button>
                    <DropdownMenu class="drop-menu" slot="list">
                        <DropdownItem name="oauth_index" key="6-1"><span class="drop-info">三方系统</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                menuDisplay: {
                    org: false,
                    ten: false,
                    res: false,
                    use: false,
                    rol: false,
                    thr: false
                },
                menuListDisplay: []

            };
        },
        created () {
            let localQ = JSON.parse(localStorage.getItem('Jurisdiction'));
            if (localQ.length !== 0) {
                localQ.forEach(r => {
                    this.menuListDisplay.push(r.resourceName);
                });

                for (var variable of this.menuListDisplay) {
                    if (variable == '三方系统') {
                        this.menuDisplay.thr = true;
                    }else if (variable == '角色管理') {
                        this.menuDisplay.rol = true;
                    } else if (variable == '用户管理') {
                        this.menuDisplay.use = true;
                    } else if (variable == '资源管理') {
                        this.menuDisplay.res = true;
                    } else if (variable == '租户管理') {
                        this.menuDisplay.ten = true;
                    } else if (variable == '组织机构管理') {
                        this.menuDisplay.org = true;
                    }
                }
            }
        },
        name: 'sidebarMenuShrink',
        props: {
            menuList: {
                type: Array
            },
            iconColor: {
                type: String,
                default: 'white'
            },
            menuTheme: {
                type: String,
                default: 'dark'
            }
        },
        methods: {
            changeMenu (active) {
                this.$emit('on-change', active);
            },
            itemTitle (item) {
                if (typeof item.title === 'object') {
                    return this.$t(item.title.i18n);
                } else {
                    return item.title;
                }
            }
        }
    };
</script>
