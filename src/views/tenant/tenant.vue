<template>

    <div class="list_page">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="6">
            <h2 style="margin: 6px 0 0 20px">租户管理</h2>
            </Col>
            <Col span="3" style='text-align:right;margin-right:5px;'>
            <!--<Button type="primary" @click="addTenant">新增租户</Button>-->
            </Col>
        </Row>
        <Row>
            <Col>
            <Table border :columns="tenantTable" :data="tenantTableData" :loading='SpinType' class="com_table"></Table>
            </Col>
        </Row>
        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import api from '@/api';
    import tenantAdd from '@/views/tenant/tenantAdd';
    import md5 from 'js-md5';

    export default {
        computed: {},
        components: {},
        data () {
            return {
                SpinType: false,
                page: {
                    pageSize: 10,
                    pageIndex: 1,
                },
                dataCount: 0,
                tenantTable: [
                    {
                    title: '租户名称',
                    key: 'tenantName'
                    },
                    {
                        title: '租户编码',
                        key: 'tenantCode'
                    },
                    {
                        title: '描述',
                        key: 'description',
                    },
                    {
                        title: '更新时间',
                        key: 'modifyTime'
                    },
                    {
                        title: ' ',
                        key: ' ',
                        width: '0px'
                    }
                ],
                tenantTableData: []
            };
        },
        created () {

            if (Cookies.get('tenant_index')) {
                this.page.pageIndex = Number(Cookies.get('tenant_index'));
                Cookies.remove('tenant_index');
            }
            this.tenant_list();
        },
        methods: {
            changepage (index) {
                this.page.pageIndex = index;
                this.tenant_list();
            },
            tenant_list () {
                this.SpinType = true;
                this.$axios({
                    method: 'post',
                    url: api.tenant_List(),
                    data: {
                        currentPage: this.page.pageIndex,
                        pageSize: this.page.pageSize
                    },
                }).then(res => {
                    this.SpinType = false;
                    if (res.data.code == 200) {
                        this.tenantTableData = res.data.data;
                        this.dataCount = res.data.page.totalRecords;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            addTenant () {
                this.$router.push({path: '/tenant/addtenant'});
            },
            shows (index) {
                this.$router.push({name: 'tenant_updateTenant', query: {data6: this.tenantTableData[index]}});
            }

        }
    };
</script>
<style scoped>

</style>
