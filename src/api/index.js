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
export const getAllMenu = ()=>{
    return getRequest('/res/permission/actions/query/allMenus');
}