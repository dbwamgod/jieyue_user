<template>
    <Breadcrumb>
        <BreadcrumbItem
                v-for="item in currentPath"
                href=""
                :key="item.name"
        >{{ itemTitle(item)}}
        </BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
    export default {
        name: 'breadcrumbNav',
        props: {
            currentPath: Array
        },
        methods: {
            org () {
                // this.$router.push({name:"home_index"})
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

