<template>
    <div style="display: inline-block">
        <Button :type="type" :size="size" @click="Edit" :disabled="disabled">修改</Button>
        <Modal
                v-model="editModal"
                title="修改信息"
                :footer-hide='true'
                :closable="false"
                :mask-closable="false">
            <!--:rules="editRule"-->
            <Form ref="editRef" :model="editItem" :rules="editRule">

                <FormItem :prop="item.prop" :label="item.label" v-for="(item,i) in editData" :key="i" v-show="!Boolean(Number(item.show))">
                    <p style="margin-top:32px;" v-if="item.text">
                        {{item.text?editItem[item.model]:''}}
                    </p>
                    <Input :type="item.type" v-model="editItem[item.model]" :placeholder="item.placeholder"
                           v-if="!item.html"></Input>
                    <span style="    float: left;
    line-height: 24px;    color: #999;" v-if="Boolean(Number(item.tip))"><Icon type="information-circled" style="color: #2baee9;" :size="18"></Icon>{{item.tipInfo}}</span><!--三方系统-->
                    <RadioGroup v-model="editItem[item.model]" v-if="item.html&&Boolean(Number(item.html))">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup><!--资源系统-->
                </FormItem>
            </Form>
            <div class="sure-cancel">
                <Button type="primary" @click="sure" class="sure_edit">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
    </div>


</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                sty: '',
                editModal: false,
                editItem: {},
                editRule: {
                    ...this.EditRule
                },
                isShow: false
            };
        },
        props: [
            'type',
            'size',
            'index',
            'check_list',
            'apiInfo',
            'id',
            'editData',
            'EditRule',
            'apiInfoId',
            'page',
            'user',
            'disabled',
            'resData'

        ],
        name: 'edit',
        watch: {
            'editItem.isMenu' (to, form) {

                if (to == 0) {      this.editData[3].show = '0';
                    this.editData[4].show = '1';
                    this.editRule.url = [{
                        required: true,
                        type: 'string',
                        pattern: /\S/,
                        message: '请输入url路径且不为空',
                        trigger: 'blur'
                    }];


                } else {
                    this.editData[3].show = '1';
                    this.editData[4].show = '0';
                    this.editRule.url = [];

                }
            }
        },
        methods: {
            Edit () {
                this.user == 'user' ? this.$axios({
                        method: 'post',
                        url: this.apiInfoId(),
                        data: {userId: this.id}
                    }).then(r => {
                        if (r.data.code == 200) {
                            this.editItem = JSON.parse(JSON.stringify(r.data.data));
                            this.editModal = true;
                            Cookies.set('org_num', this.index);
                            Cookies.set('home_index', this.page);
                        }
                    }) : this.$axios({
                        method: 'get',
                        url: this.apiInfoId(this.id),
                    }).then(r => {
                        if (r.data.code == 200) {
                            this.editItem = JSON.parse(JSON.stringify(r.data.data));
                            this.editItem.isMenu?this.editItem.isMenu= String(this.editItem.isMenu):"";//因为赋值时是number类型的,所以需要转换成字符串
                            this.editModal = true;

                            Cookies.set('org_num', this.index);
                            Cookies.set('home_index', this.page);
                        }
                    });

            },
            sure () {
                this.$refs.editRef.validate((valid) => {
                    if (valid) {
                        this.sty="tip";
                        let userEdit= this.user=="user"?[this.editItem].map(r=>{
                           return{
                                email:r.email,
                                employeeCode:r.employeeCode,
                                mobile:r.mobile,
                                nickname:r.nickname,
                                orderNo:r.orderNo||100,
                                userId:r.userId,
                            }
                        }):"";


                        this.editItem.userId = Cookies.get('user_userId');
                        this.$axios({
                            method: 'post',
                            url: this.apiInfo(),
                            data: userEdit[0] || this.editItem,
                            headers: {
                                Authorization: Cookies.get('token'),
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            if (res.data.code === 200) {
                                this.$Message.info('已修改');
                                this.check_list();
                                this.editModal = false;
                            } else {
                                this.$Message.info(res.data.msg);
                            }
                        });
                    } else {
                        this.$Message.error('所修改的信息不能为空!');
                        this.sty = 'tipRed';
                    }
                });
            },
            cancel () {
                this.$refs.editRef.resetFields();
                this.editModal = false;
                this.$Message.info('已取消');
            },
        },

        created() {
            this.editData.map(r => {
                Object.assign(this.editItem,{
                    [r.prop]:''
                })
            });//为editItem赋值属性名
        },
    };
</script>

<style scoped lang="less">
    .tip {
        color: #999;
    }
    .tipRed {
        color: #ed4014;
    }
</style>
