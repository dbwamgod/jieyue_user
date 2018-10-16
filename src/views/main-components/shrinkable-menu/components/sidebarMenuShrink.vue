<template>
    <div>
        <template>
            <div style="text-align: center;" key="grala">
                <Dropdown v-if="menuDisplay.org" transfer placement="right-start" :key="1" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon type="pie-graph" :size='20' color="#fff"></Icon>

                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="home_index" key="1-1"><span style="padding-left:10px;">组织机构管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.ten" transfer placement="right-start" :key="2" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon"></Icon> -->
                        <Icon type="android-contacts" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="tenant_index" key="2-1"><span style="padding-left:10px;">租户管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.res" transfer placement="right-start" :key="3" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon"></Icon> -->
                        <Icon type="social-buffer" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="resource_index" key="3-1"><span style="padding-left:10px;">资源管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.use" transfer placement="right-start" :key="4" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon"></Icon> -->
                        <Icon type="android-person" :size='20' color="#fff"></Icon>

                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="accesstest_index" key="3-1"><span style="padding-left:10px;">用户管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown v-if="menuDisplay.rol" transfer placement="right-start" :key="5" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon"></Icon> -->
                        <Icon type="ribbon-b" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="access_index" key="3-1"><span style="padding-left:10px;">角色管理</span>
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
                }, menuListDisplay: []

            };
        },
        created () {
            let localQ = JSON.parse(localStorage.getItem('Jurisdiction'));
            if (localQ.length !== 0) {
                localQ.forEach(r => {
                    this.menuListDisplay.push(r.resourceName);
                });

                for (var variable of this.menuListDisplay) {
                    if (variable == '角色管理') {
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
                default: 'darck'
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
