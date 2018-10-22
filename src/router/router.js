import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/organization-management-system',
    component: Main,
    children: [
        {
            path: 'addOrganization',
            title: '增加组织接口',
            name: 'addOrganization',
            component: () => import('@/views/home/addOrganization.vue')

        },
        {
            path: 'add',
            title: '新增接口',
            name: 'addResources',
            component: () => import('@/views/resource/addResources.vue')

        },
        {
            path: 'organization-management-system',
            title: '组织机构管理',
            name: 'index',
            component: () => import('@/views/home/home.vue'),
        },

        {path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue')},
        {
            path: 'bang_access',
            title: '绑定角色',
            name: 'bang_access',
            component: () => import('@/views/user/binding_role.vue')
        }, {
            path: 'bangAccess',
            title: '绑定资源',
            name: 'access_bang',
            component: () => import('@/views/role/binding_rescourse.vue')
        },
        {
            path: 'lost_list',
            title: '失败列表',
            name: 'lost_list',
            component: () => import('@/views/user/lost_list.vue')
        },
        {
            path: 'addAccess',
            title: '新增用户',
            name: 'access_add',
            component: () => import('@/views/user/add_user.vue')
        },
        {
            path: 'addAccess',
            title: '新增角色',
            name: 'access_adds',
            component: () => import('@/views/role/add_role.vue')
        },
    ],

};


// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/resource',
        icon: 'android-globe',
        name: 'resource',
        title: '资源管理',
        component: Main,
        children: [
            {
                path: 'index',
                title: '资源管理',
                name: 'resource_index',
                component: () => import('@/views/resource/resource.vue')
            },
        ]

    },
    {
        path: '/tenant',
        icon: 'android-contacts',
        name: 'tenant',
        title: '租户管理',
        component: Main,
        children: [
            {
                path: 'index',
                title: '租户管理',
                name: 'tenant_index',
                component: () => import('@/views/tenant/tenant.vue')
            },
            /*   {
                   path: 'addTenant',
                   title: '新增租户',
                   name: 'tenant_addTenant',
                   component: () => import('@/views/tenant/tenantAdd.vue')
               },*/
            /*   {
                   path: 'updateTenant/:id',
                   title: '更新租户',
                   name: 'tenant_updateTenant',
                   component: () => import('@/views/tenant/tenantUpdate.vue')
               },*/

        ]
    },
    {
        path: '/organization-management-system',
        icon: 'lock-combination',
        name: 'organization',
        title: '系统配置',
        component: Main,
        children: [
            {
                path: 'index',
                title: '系统配置',
                name: 'home_index',
                component: () => import('@/views/home/home.vue'),
            },
        ]
    },
    {
        path: '/access-test',
        icon: 'android-person',
        title: '用户管理',
        name: 'accesstest',
        component: Main,
        children: [
            {
                path: 'index',
                title: '用户管理',
                name: 'accesstest_index',
                component: () => import('@/views/user/user.vue')
            },

        ]
    },
    {
        path: '/access-management-system',
        icon: 'ribbon-b',
        name: 'access',
        title: '角色管理',
        component: Main,
        children: [
            {
                path: 'index',
                title: '角色管理',
                name: 'access_index',
                component: () => import('@/views/role/role.vue')
            },
        ]
    }, {
        path: '/oauth_client',
        icon: 'md-contact',
        name: 'oauth',
        title: '三方系统',
        component: Main,
        children: [
            {
                path: 'index',
                title: '三方系统',
                name: 'oauth_index',
                component: () => import('@/views/three_brower/three_brower.vue')
            },
            {
                path: 'new_create',
                title: '新增三方系统',
                name: 'add_oauth',
                component: () => import('@/views/three_brower/add_oauth.vue')
            },
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
