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
export const getTellerList = (params) => {

    return postRequest('/base/api/tellers/infos?pageSize='+params.pageSize +"&pageIndex="+params.pageIndex, params)
}