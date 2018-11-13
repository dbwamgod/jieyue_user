const _baseUrlC = 'http://172.18.101.118:10000';
const user_baseUrlC =_baseUrlC+ '/platform-user-api';
const com_baseUrlC =_baseUrlC+ '/platform-user-admin';
/* 生产
*/
// const user_baseUrlC = 'http://api.bdc.jieyue.com/api/platform-user-api';
// const _baseUrlC = 'http://api.bdc.jieyue.com/api';
// const com_baseUrlC = 'http://api.bdc.jieyue.com/api/platform-user-admin';
import Cookies from 'js-cookie';

//权限
function way (code) {
    let urlAry;
    JSON.parse(localStorage.getItem('child')).forEach(r => {
        if (r.resourceCode == code) {
            urlAry = r.url;
        }
    });
    return urlAry;
}

//token
function cookies_con(){
    let cookies_cons='access_token=' + Cookies.get('user_token');
    return cookies_cons;
}
export default {
    _baseUrlC,
    // 租户管理 //新增租户
    // 查询租户列表
    tenant_List () {
        let code = 'TENANT-LIST';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    tenant_Add () {
        let code = 'ORG-UPDATE';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },

    //获取资源权限
    Resource_permissions () {
        return com_baseUrlC + `/user/find/auth/?` + cookies_con();
    },
    // 查询租户
    tenant_Find () {
        return com_baseUrlC + '/tenant/find/?' + cookies_con();
    },

    // 查询租户列表
    tenant_ListId () {
        return com_baseUrlC + '/tenant/find/name_list?' + cookies_con();
    },
    // 更新租户
    tenant_update () {
        let code = 'ORG-UPDATE';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },

    // 角色接口
    // 列表/
    role_list () {
        let code = 'ROLE-LIST';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 新增资源
    role_add () {
        let code = 'ROLE-ADD';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 为角色绑定资源
    role_bound () {
        let code = 'ROLE-BOUND_RES';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 查询角色绑定资源
    role_bounds (id) {
        let code = 'ROLE-F_B_RES';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}/` + id + '?' + cookies_con();
    },
    // 删除资源
    role_del () {
        let code = 'ROLE-DEL';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 查询角色
    role_roleId (id) {
        return com_baseUrlC + '/role/find/' + id + '?' + cookies_con();
    },
    // 修改
    role_update () {
        let code = 'ROLE-UPDATE';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },

    // 资源接口
    // 查询资源列表
    res_list () {
        let code = 'RES-LIST';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    res_lists () {
        return com_baseUrlC + '/resource/find/group/name?' + cookies_con();
    },
    // 查询资源树形列表
    res_list_tree () {
        return com_baseUrlC + '/resource/find/list/tree?' + cookies_con();
    },
    // 新增
    res_add () {
        let code = 'RES-ADD';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 修改
    res_update () {
        let code = 'RES-UPDATE';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 删除
    res_del () {
        let code = 'RES-DEL';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 查询
    res_search (id) {
        return com_baseUrlC + '/resource/find/' + id + '?' + cookies_con();
    },
    // 登录
    login () {
        return _baseUrlC + '/platform-user-oauth2/oauth/token';

    },
    //获取userID
    userId () {
        return _baseUrlC + '/platform-user-oauth2/user?' + cookies_con();
    },
    // 增加用户
    userAdd () {
        let code = 'USER-ADD';
        let wayResult = way(code);
        return user_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // '查询绑定角色';
    userAccess () {
        let code = 'USER-F_B_ROLE';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // '绑定角色';
    user_bang () {
        let code = 'USER-BOUND_ROLE';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 查询用户
    userUserId () {
        return user_baseUrlC + '/user/byUserId?' + cookies_con();
    },
    // 用户删除
    userDelete () {
        let code = 'USER-DEL';
        let wayResult = way(code);
        return user_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 用户修改
    userUpdate () {
        let code = 'USER-UPDATE';
        let wayResult = way(code);
        return user_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 用户列表
    userList () {
        let code = 'USER-LIST';
        let wayResult = way(code);
        return user_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 失败列表
    userFail () {
        let code = 'FAIL-LIST';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 失败列表重发
    userFailAgain () {
        let code = 'FAIL-ANEW_SEND';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },

    // 新增组织结构
    organizationAdd () {
        let code = 'ORG-ADD';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 查询分类的父id
    organizationFindGroupParent_id () {
        return com_baseUrlC + '/organization/find/group/parent_id?' + cookies_con();
    },
    // 查询分类的
    organizationFindGroupName (jsRoot) {

        return com_baseUrlC + '/organization/find/group/name?'+`${jsRoot?'isRoot=true&':""}` + cookies_con();
    },
    // 查询组织机构
    organizationFindName (id) {

        return com_baseUrlC + '/organization/find/'+id +"?"+ cookies_con();
    },
    // 查询组织列表
    organizationList () {
        let code = 'ORG-LIST';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // 更新组织的列表
    organizationUpdate () {
        let code = 'ORG-UPDATE';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    // shanchu 组织的列表
    organizationDel () {
        let code = 'ORG-DEL';
        let wayResult = way(code);

        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },

    //三方系统
    //三方系统列表
    oauthThreeList () {
        let code = 'THREE_SYSTEM-LIST';
        let wayResult = way(code);

        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    //新增三方系统
    addoauthThree () {
        let code = 'THREE_SYSTEM-ADD';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
    //获取查询当前修改的id
    getoauthThree (id) {
        return com_baseUrlC + `/oauth_client/find/` + id + '?' + cookies_con();
    },
    //修改三方系统
    editoauthThree () {
        let code = 'THREE_SYSTEM-UPDATE';
        let wayResult = way(code);
        return com_baseUrlC + `${wayResult}?` + cookies_con();
    },
};
