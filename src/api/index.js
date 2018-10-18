const _baseUrlC = 'http://172.18.101.118:10000';
// const _baseUrlC = 'http://api.bdc.jieyue.com/api';
import Cookies from 'js-cookie';

function way (code) {
    let urlAry;
    JSON.parse(localStorage.getItem('child')).forEach(r => {
        if (r.resourceCode == code) {
            urlAry = r.url;
        }
    });
    return urlAry;
}

export default {
    _baseUrlC,

    // 租户管理 //新增租户
    // 查询租户列表
    tenant_List () {
        let code = 'TENANT-LIST';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    tenant_Add () {
        let code = 'ORG-UPDATE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    Resource_permissions () {
        return _baseUrlC + '/platform-user-admin/resource/find/auth/' + Cookies.get('user_userId') + '?' + 'access_token=' + Cookies.get('user_token');
    },
    // 查询租户
    tenant_Find () {
        return _baseUrlC + '/platform-user-admin/tenant/find/?' + 'access_token=' + Cookies.get('user_token');
    },

    // 查询租户列表
    tenant_ListId () {
        return _baseUrlC + '/platform-user-admin/tenant/find/name_list?' + 'access_token=' + Cookies.get('user_token');
    },
    // 更新租户
    tenant_update () {
        let code = 'ORG-UPDATE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },

    // 角色接口
    // 列表/
    role_list () {
        let code = 'ROLE-LIST';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 新增资源
    role_add () {
        let code = 'ROLE-ADD';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 为角色绑定资源
    role_bound () {
        let code = 'ROLE-BOUND_RES';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 查询角色绑定资源
    role_bounds (id) {
        let code = 'ROLE-F_B_RES';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}/` + id + '?' + 'access_token=' + Cookies.get('user_token');
    },
    // 删除资源
    role_del () {
        let code = 'ROLE-DEL';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 查询角色
    role_roleId (id) {
        return _baseUrlC + '/platform-user-admin/role/find/' + id + '?' + 'access_token=' + Cookies.get('user_token');
    },
    // 修改
    role_update () {
        let code = 'ROLE-UPDATE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },

    // 资源接口
    // 查询资源列表
    res_list () {
        let code = 'RES-LIST';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    res_lists () {
        return _baseUrlC + '/platform-user-admin/resource/find/group/name?' + 'access_token=' + Cookies.get('user_token');
    },
    // 查询资源树形列表
    res_list_tree () {
        return _baseUrlC + '/platform-user-admin/resource/find/list/tree?' + 'access_token=' + Cookies.get('user_token');
    },
    // 新增
    res_add () {
        let code = 'RES-ADD';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 修改
    res_update () {
        let code = 'RES-UPDATE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 删除
    res_del () {
        let code = 'RES-DEL';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 查询
    res_search (id) {
        return _baseUrlC + '/platform-user-admin/resource/find/' + id + '?' + 'access_token=' + Cookies.get('user_token');
    },
    // 登录
    login () {
        return _baseUrlC + '/platform-user-oauth2/oauth/token';

    },
    //获取userID
    userId () {
        return _baseUrlC + '/platform-user-oauth2/user?' + 'access_token=' + Cookies.get('user_token');
    },
    // 增加用户
    userAdd () {
        let code = 'USER-ADD';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-api${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // '查询绑定角色';
    userAccess () {
        let code = 'USER-F_B_ROLE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // '绑定角色';
    user_bang () {
        let code = 'USER-BOUND_ROLE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 查询用户
    userUserId () {
        return _baseUrlC + '/platform-user-api/user/byUserId?' + 'access_token=' + Cookies.get('user_token');
    },
    // 用户删除
    userDelete () {
        let code = 'USER-DEL';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-api${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 用户修改
    userUpdate () {
        let code = 'USER-UPDATE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-api${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 用户列表
    userList () {
        let code = 'USER-LIST';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-api${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 失败列表
    userFail () {
        let code = 'FAIL-LIST';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 失败列表重发
    userFailAgain () {
        let code = 'FAIL-ANEW_SEND';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },

    // 新增组织结构
    organizationAdd () {
        let code = 'ORG-ADD';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 查询分类的父id
    organizationFindGroupParent_id () {
        return _baseUrlC + '/platform-user-admin/organization/find/group/parent_id?' + 'access_token=' + Cookies.get('user_token');
    },
    // 查询分类的
    organizationFindGroupName () {
        return _baseUrlC + '/platform-user-admin/organization/find/group/name?' + 'access_token=' + Cookies.get('user_token');
    },
    // 查询组织列表
    organizationList () {
        let code = 'ORG-LIST';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // 更新组织的列表
    organizationUpdate () {
        let code = 'ORG-UPDATE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    // shanchu 组织的列表
    organizationDel () {
        let code = 'ORG-DEL';
        let wayResult = way(code);

        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },

    //三方系统
    //三方系统列表
    oauthThreeList () {
               let code = 'THREE_SYSTEM-LIST';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    //新增三方系统
    addoauthThree () {
               let code = 'THREE_SYSTEM-ADD';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?` + 'access_token=' + Cookies.get('user_token');
    },
    //获取查询当前修改的id
    getoauthThree (id) {
        return _baseUrlC + `/platform-user-admin/oauth_client/find/` +id+"?"+ 'access_token=' + Cookies.get('user_token');
    },
    //修改三方系统
    editoauthThree () {
               let code = 'THREE_SYSTEM-UPDATE';
        let wayResult = way(code);
        return _baseUrlC + `/platform-user-admin${wayResult}?`+ 'access_token=' + Cookies.get('user_token');
    },
};