<template>

    <div style='position: relative;height:100%;padding:10px;'>


        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="6">
            <div style="padding:5px 0 ; font-weight:700; font-size:18px;">资源接口</div>
            </Col>
            <Breadcrumb>
                <BreadcrumbItem :to="{ name: 'resource_index'}">切换列表</BreadcrumbItem>
            </Breadcrumb>
        </Row>
        <div style="display: flex">   <Tree :data="data1" style="flex: 1" ></Tree>
            <Tree :data="data2" style="flex: 1"></Tree>
            <Tree :data="data3" style="flex: 1"></Tree>
            <Tree :data="data4" style="flex: 1"></Tree></div>


    </div>
</template>
<style scoped>
    .paging {
        float: right;
        margin-top: 10px;
    }
</style>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                data1: [],
                data2: [],
                data3: [],
                data4: [],
            };
        },
        computed: {},
        created () {
            this.res_List();
        },
        methods: {

            res_List () {
                this.$axios({
                    method: 'post',
                    url: api.res_list(),
                    data: {
                        currentPage: 1,
                        pageSize: 10
                    },
                    headers:{
                        Authorization:Cookies.get("token"),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {

                    if (res.data.code == 200) {
                        this.res_lists = res.data.data;
                         this.data1 = [
                                    {
                                        title: '资源树形列表',
                                        expand: false,
                                        children: [
                                            {
                                                title: 'resourceId',
                                                expand: false,
                                                children: [
                                                    {
                                                        title: this.res_lists[0].resourceId
                                                    },
                                                ]
                                            },
                                            {
                                                title: 'tenantId',
                                                expand: false,
                                                children: [
                                                    {
                                                        title: this.res_lists[0].tenantId
                                                    }
                                                ]
                                            },
                                            {
                                                title: 'parentId',
                                                expand: false,
                                                children: [
                                                    {
                                                        title: this.res_lists[0].parentId
                                                    },
                                                ]
                                            },
                                            {
                                                title: 'resourceName',
                                                expand: false,
                                                children: [
                                                    {
                                                        title: this.res_lists[0].resourceName
                                                    }
                                                ]
                                            },
                                            {
                                                title: 'description',
                                                expand: false,
                                                children: [
                                                    {
                                                        title: this.res_lists[0].description
                                                    },
                                                ]
                                            },
                                            {
                                                title: 'modifyTime',
                                                expand: false,
                                                children: [
                                                    {
                                                        title: this.res_lists[0].modifyTime
                                                    }
                                                ]
                                            },

                                        ]
                                    }
                                ];
                         this.data2 = [
                            {
                                title: '资源树形列表',
                                expand: false,
                                children: [
                                    {
                                        title: 'resourceId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[1].resourceId
                                            },
                                        ]
                                    },
                                    {
                                        title: 'tenantId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[1].tenantId
                                            }
                                        ]
                                    },
                                    {
                                        title: 'parentId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[1].parentId
                                            },
                                        ]
                                    },
                                    {
                                        title: 'resourceName',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[1].resourceName
                                            }
                                        ]
                                    },
                                    {
                                        title: 'description',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[1].description
                                            },
                                        ]
                                    },
                                    {
                                        title: 'modifyTime',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[1].modifyTime
                                            }
                                        ]
                                    },

                                ]
                            }
                        ];
                         this.data3 = [
                            {
                                title: '资源树形列表',
                                expand: false,
                                children: [
                                    {
                                        title: 'resourceId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[2].resourceId
                                            },
                                        ]
                                    },
                                    {
                                        title: 'tenantId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[2].tenantId
                                            }
                                        ]
                                    },
                                    {
                                        title: 'parentId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[2].parentId
                                            },
                                        ]
                                    },
                                    {
                                        title: 'resourceName',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[2].resourceName
                                            }
                                        ]
                                    },
                                    {
                                        title: 'description',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[2].description
                                            },
                                        ]
                                    },
                                    {
                                        title: 'modifyTime',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[2].modifyTime
                                            }
                                        ]
                                    },

                                ]
                            }
                        ];
                         this.data4 = [
                            {
                                title: '资源树形列表',
                                expand: false,
                                children: [
                                    {
                                        title: 'resourceId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[3].resourceId
                                            },
                                        ]
                                    },
                                    {
                                        title: 'tenantId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[3].tenantId
                                            }
                                        ]
                                    },
                                    {
                                        title: 'parentId',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[3].parentId
                                            },
                                        ]
                                    },
                                    {
                                        title: 'resourceName',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[3].resourceName
                                            }
                                        ]
                                    },
                                    {
                                        title: 'description',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[3].description
                                            },
                                        ]
                                    },
                                    {
                                        title: 'modifyTime',
                                        expand: false,
                                        children: [
                                            {
                                                title: this.res_lists[3].modifyTime
                                            }
                                        ]
                                    },

                                ]
                            }
                        ];

                    }else{this.$Message.info(res.data.msg);}
                });

            },
        }
    };
</script>
