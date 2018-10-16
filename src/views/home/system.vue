<template>
    <div>
        <Row>
            <Menu :theme="theme2" style="position: absolute;top: 10px; left: 45%; font-size: 17px">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-paper"/>
                        系统管理
                    </template>
                </Submenu>
            </Menu>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'system',
        data () {
            return {theme2: 'light'};
        },
        created(){
            this.$router.push({name:"home_index"})
        },
        methods: {
            one1 () {
            }
        }
    };
</script>

<style scoped>

</style>