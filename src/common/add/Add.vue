<template>
    <div style="display: inline-block;">
        <Button type="primary" @click="add_ops">新增组织机构管理</Button>

        <Modal
                v-model="AddModal"
                title="新增组织机构接口"
                :footer-hide='true'
                :closable="false"
                :mask-closable="false">
            <!--:rules="editRule"-->
            <Form ref="AddRef" :model="editItem" :rules="editRule">
                <FormItem :prop="item.prop" :label="item.label" v-for="(item,i) in editData" :key="i"
                          v-show="!Boolean(Number(item.show))">
                    <Input :type="item.type" v-model="editItem[item.model]" :placeholder="item.placeholder"
                           v-if="!item.html"></Input>
                    <!--                    <RadioGroup v-model="editItem[item.model]" v-if="item.html&&Boolean(Number(item.html))">
                                            <Radio label="1">是</Radio>
                                            <Radio label="0">否</Radio>
                                        </RadioGroup>&lt;!&ndash;资源系统&ndash;&gt;-->

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
    export default {
        name: 'add',
        data () {
            return {
                AddModal: false
            };
        },
        prop: {},
        methods: {
            add_ops () {
                this.AddModal = true;
            },
            sure () {

            },
            cancel () {
                this.$refs.editRef.resetFields();
                this.AddModal = false;
                this.$Message.info('已取消');
            }
        }
    };
</script>

<style scoped>

</style>
