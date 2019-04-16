// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest } from '@/libs/axios';
// 文件上传接口
export const uploadFile = "/xboot/upload/file"
// 获取菜单
export const getMenuList = () => {
    return postRequest('/res/api/res/auth/actions/tree')
}
// 获取验证码
export const getCaptImage = () => {
    return postRequest('/cert/api/cert/actions/captcha')
}
// 登陆
export const login = (params) => {
    return postRequest('/cert/api/cert/actions/login', params)
}
//获取人员列表
export const getTellerList = (params) => {
    return postRequest('/base/api/tellers/infos?pageSize='+params.pageSize +"&pageIndex="+params.pageIndex, params)
}
//重置人员密码
export const resetTellerPasswd = (params)=>{
    return postRequest('/base/api/tellers/actions/resetpwd',params)
}
//删除人员
export const delTeller = (params)=>{
    return postRequest('/base/api/tellers/actions/del',params)
}
export const getDictDataByDictId = (params)=>{
    return getRequest('/dict/api/dict/entrties/actions/query?dictTypeId='+params)
}
export const getMaxTellerId = (params)=>{
    return postRequest('/base/api/tellers/actions/querymax')
}
export const getTellerById = (params)=>{
    return postRequest('/base/api/tellers/actions/querymax')
}
export const addTeller = (params)=>{
    return postRequest('/base/api/tellers/actions/add',params)
}
export const upTeller = (params)=>{
    return postRequest('/base/api/tellers/actions/up',params);
}
export const getAllMenu = (parentId)=>{
    let url = "/res/api/menus";
    if(parentId){
        url = url + "?parentId="+parentId;
    }
    return getRequest(url);
}
export const addMenu=(params)=>{
    return postRequest('/res/api/menu/actions/add',params);
};
export const getMenuById=(params)=>{
    return getRequest('/res/api/menu/'+params);
};
export const updateMenuById=(params)=>{
    return postRequest('/res/api/menu/actions/up',params);
};
export const delMenu=(params)=>{
    return getRequest('/res/api/menu/actions/del/'+params);
}
export const queryAllRoles=(params)=>{
    return postRequest('/res/api/position/positions?pageSize='+params.pageSize +"&pageIndex="+params.pageIndex,params);
};
export const saveRole=(params)=>{
    return postRequest('/res/api/position/actions/add',params);
};
export const delRole=(params)=>{
    return getRequest('/res/api/position/actions/del?positionCode='+params);
};
export const upRole=(params)=>{
    return postRequest('/res/api/position/actions/up',params);
};
export const querMenusWithRoleCode=(params)=>{
    return getRequest('/res/api/res/auth/menus/checks?roleCode='+params);
};
export const saveMenuAuthConfig=(params,roleCode)=>{
    return postRequest('/res/api/res/auth/menus/checks?roleId='+roleCode,params);
};
export const changePassPwd=(params)=>{
    return postRequest('/base/api/tellers/actions/changepwd',params);
};
export const queryImageItems=(params)=>{
    return postRequest('/base/front/items?pageSize='+params.pageSize +"&pageIndex="+params.pageIndex,params);
};
export const delItem=(id)=>{
    return getRequest('/base/front/item/action/del/'+id);
};
export const queryImagesByItemsId=(id)=>{
    return getRequest('/base/front/item/'+id);
};
export const saveFileInfo=(params)=>{
    return postRequest('/fileService/file/fileInfo/save',params);
};
export const delImages=(id)=>{
    return getRequest('/fileService/file/fileInfo/del/'+id);
};
export const saveImages=(params)=>{
    return postRequest('/base/front/images/save',params);
};
export const delImagesItem=(params)=>{
    return getRequest('/base/front/item/action/del/'+params);
};
export const queryDictTypes=(params)=>{
    return postRequest('/dict/api/dict/types?pageSize='+params.pageSize +"&pageIndex="+params.pageIndex,params);
};
export const queryDictItems=(params)=>{
    return postRequest('/dict/api/dict/entrties?pageSize='+params.pageSize +"&pageIndex="+params.pageIndex,params);
};
export const saveAddTypeFrom=(params)=>{
    return postRequest('/dict/api/dict/type/actions/add',params);
};
export const saveUpTypeFrom=(params)=>{
    return postRequest('/dict/api/dict/types/actions/up',params);
};
export const delDictType=(params)=>{
    return postRequest('/dict/api/dicts/types/actions/del',params);
};
export const saveAddDictItem=(params)=>{
    return postRequest('/dict/api/dict/entrties/actions/add',params);
};
export const saveUpdateDictItem=(params)=>{
    return postRequest('/dict/api/dict/entrties/actions/up',params);
};
export const delDictItem=(params)=>{
    return postRequest('/dict/api/dict/entrties/actions/del',params);
};