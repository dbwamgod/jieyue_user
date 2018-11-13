<template>
    <Button :type="type" :size="size" @click="Remove">删除</Button>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        props: [
            'type',
            'size',
            'dataInfo',
            'index',
            'check_list',
            'text',
            'apiInfo',
            'id'
        ],
        name: 'delete',
        methods: {
            Remove () {
                let cloneData =this.id === 'userId' ? {[this.id]: this.dataInfo[this.index][this.id]} : {[this.id]: this.dataInfo[this.index][this.id], userId: Cookies.get('userId')};

                this.$Modal.confirm({
                    title: '删除警告',
                    content: `<p>您确定要删除该${this.text}吗</p>`,
                    loading: true,
                    onOk: () => {
                        setTimeout(() => {
                            this.$axios({
                                method: 'post',
                                url: this.apiInfo(),
                                data: cloneData,
                                headers: {
                                    Authorization: Cookies.get('token'),
                                    'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }).then(res => {
                                if (res.data.code == 200) {
                                    if (this.dataInfo.length < 2) {
                                        this.check_list(-1);
                                    } else {
                                        this.check_list();
                                        this.$Message.info('已删除');
                                        this.searchInfo = true;
                                    }
                                    this.$Modal.remove();
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.info(res.data.msg);
                                }
                            });
                        }, 0);
                    }
                });
            },
        }
    };
</script>
