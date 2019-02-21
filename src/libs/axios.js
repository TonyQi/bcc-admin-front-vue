import axios from 'axios';
import { getStore, setStore } from './storage';
import { router } from '../router/index';
import { Message } from 'iview';
import Cookies from 'js-cookie';
// 统一请求路径前缀
let base = '';
// 超时设定
axios.defaults.timeout = 15000;
axios.interceptors.request.use(config => {
    return config;
}, err => {
    Message.error('请求超时');
    return Promise.resolve(err);
});

// http response 拦截器
axios.interceptors.response.use(response => {
    const data = response.data;
    return data;
}, (err) => {
    switch (err.response.status) {
        case 401:
            // 未登录 清除已登录状态
            setStore('accessToken', '');
            router.push('/login');
            Promise.resolve(err)
            break;
        case 403:
            setStore('accessToken', '');
            router.push('/login');
            Promise.resolve(err)
            break;
        case 500:
            // 错误
            if (data.message !== null) {
                Message.error(data.message);
            } else {
                Message.error("未知错误");
            }
            break;
        default:
            // 返回状态码不为200时候的错误处理
            Message.error(err.toString());
            // Promise.resolve(err);
    }
});

export const getRequest = (url, params) => {
    let accessToken = getStore('accessToken');
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        data:{},
        headers: {
            'X-ER-UAT': accessToken,
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
};

export const postRequest = (url, params) => {
    let accessToken = getStore("accessToken");
    if(!params){
        params = {};
    }
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: {
            'X-ER-UAT': accessToken
        }
    });
};

export const putRequest = (url, params) => {
    let accessToken = getStore("accessToken");
    return axios({
        method: 'put',
        url: `${base}${url}`,
        params: params,
        headers: {
            'Content-Type':'application/json',
            'X-ER-UAT': accessToken
        }
    });
};

export const deleteRequest = (url, params) => {
    let accessToken = getStore('accessToken');
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params,
        headers: {
            'X-ER-UAT': accessToken
        }
    });
};

export const uploadFileRequest = (url, params) => {
    let accessToken = getStore('accessToken');
    return axios({
        method: 'post',
        url: `${base}${url}`,
        params: params,
        headers: {
            'X-ER-UAT': accessToken
        }
    });
};
