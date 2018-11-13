<template>

    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="6">
            <h2 style="margin: 6px 0 0 20px">租户管理</h2>
            </Col>
            <Col span="3" style='text-align:right;margin-right:5px;'>
            <!--<Button type="primary" @click="addTenant">新增租户</Button>-->
            </Col>
        </Row>
        <Row>
            <Col>
            <Table border :columns="columns7" :data="data6" :loading='SpinType' style="margin: 5px 15px 0 15px;"></Table>
            </Col>
        </Row>

        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import api from '@/api';

    export default {
        data () {
            return {
                SpinType: false,
                active: true,
                page: {
                    pageSize: 10,
                    pageIndex: 1,
                },
                dataCount: 0,
                columns7: [
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

                ],
                data6: []
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
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    this.SpinType = false;
                    if (res.data.code == 200) {

                        this.data6 = res.data.data;
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
                this.$router.push({name: 'tenant_updateTenant', query: {data6: this.data6[index]}});
            }

        }
    };
</script>
<style scoped>
    .paging {
        float: right;
        margin-top: 10px;
        margin-right: 15px;
    }
</style>
