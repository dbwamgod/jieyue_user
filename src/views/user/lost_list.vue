<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="4">
            <h2 style="margin: 6px 0 0 20px">失败列表</h2>
            </Col>

            <Col style='text-align:right;width: 35%;margin-right:15px;'>
            <Input size="large" v-model="searchWord" placeholder="请输入失败原因或失败内容" style="width: 35%;height: 34px;"/>
            <Button type="primary" @click='searchChange'>
                <Icon type="ios-search-strong" style=" font-size:17px;"></Icon>
            </Button>
            <Button type="primary" @click="back">返回用户列表</Button>
            </Col>

        </Row>
        <Table border :columns="columns7" :data="data6" :loading='SpinType' style="margin: 5px 15px 0 15px;"></Table>
        <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging"
              @on-change="changepage"></Page>
    </div>


</template>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        inject: ['reload'],
        data () {
            return {
                again_call: false,
                SpinType: false,

                searchInfo: false,
                searchWord: '',
                dataCount: 0,
                page: {
                    pageIndex: 1,
                    pageSize: 5
                },
                columns7: [

                    {
                        title: '监听者名称',
                        key: 'listenerName'
                    },
                    {
                        title: '失败原因',
                        key: 'failReason'
                    },{
                        title: '失败内容',
                        key: 'failContent'
                    },

                ],
                data6: [
                    {
                        description: '',
                        failContent: '',
                        listenerName: '',
                        failReason: '',
                        failId: ''
                    }
                ]
            };
        },
        created () {
            this.$store.commit('bindingChange');
            this.$store.commit('lostSearch');
            if (this.$store.state.app.lostSearchFlag.length !== 0) {
                this.searchWord = this.$store.state.app.lostSearchFlag;
            }
            this.init();
            JSON.parse(localStorage.getItem('Jurisdiction')).forEach(r => {
                r.child.forEach(r => {
                    if (r.resourceName == '失败记录重发') {
                        this.columns7[3] = {
                            title: '操作',
                            key: 'action',
                            width: 150,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.show(params.index, params.row);
                                            }
                                        }
                                    }, '重发'),
                                ]);
                            }
                        };
                    }
                });
            });
        },
        methods: {
            searchChange () {
                this.searchInfo = true;
                this.page.pageIndex=1
                this.$store.commit('lostSearch', this.searchWord);
                this.$axios({
                    method: 'post',
                    url: api.userFail(),
                    data: {
                        keyword:  this.$store.state.app.lostSearchFlag|| '',
                        currentPage: this.searchInfo ? this.page.pageIndex : 1,
                        pageSize: this.page.pageSize
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.SpinType = false;
                        if (res.data.data) {
                            this.data6 = res.data.data;
                            this.dataCount = res.data.page.totalRecords;
                        } else {
                            this.dataCount = 0;
                            this.data6 = [];
                        }
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
            back () {
                this.$router.back(-1);
            },
            changepage (index) {
                this.page.pageIndex = index;
                this.init();
            },
            //失败列表
            init () {
                this.SpinType = true;
                this.$axios({
                    method: 'post',
                    url: api.userFail(),
                    data: {
                        keyword:this.$store.state.app.lostSearchFlag|| '' ,
                        currentPage:  this.searchInfo ? this.page.pageIndex ||1 : this.page.pageIndex,
                        pageSize: this.page.pageSize
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.SpinType = false;
                        if (res.data.data) {
                            this.data6 = res.data.data;
                            this.dataCount = res.data.page.totalRecords;
                        } else {
                            if (this.searchInfo) {
                                if(res.data.page==null){
                                    this.data6=[]
                                    this.dataCount =0
                                }else{
                                    this.dataCount = res.data.page.totalRecords;
                                    --this.page.pageIndex;
                                    this.init()
                                }
                                // this.data6 = [];
                            } else  {

                                if(res.data.page){
                                    --this.page.pageIndex;
                                    this.init();
                                }
                                this.data6=[]
                                this.dataCount =0
                            }
                        }
                        // this.searchInfo = false;
                    } else {
                        this.$Message.info(res.data.msg);
                    }

                });
            },

            //重发
            show (index, row) {
                this.$axios({
                    method: 'post',
                    url: api.userFailAgain(),
                    data: {
                        failId: this.data6[index].failId,
                        userId: Cookies.get('user_userId')
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$Message.info('已重发');
                        this.again_call = true;
                        this.init();
                    } else {
                        this.$Message.info(res.data.msg);
                    }

                });
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