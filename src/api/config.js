import axios from "axios";
import { ElMessage } from 'element-plus';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    timeout: 10000
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response;
    },
    error => {
        // 对响应错误做点什么
        console.error('响应错误:', error);
        
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 未授权，清除token并跳转到登录页
                    localStorage.removeItem('token');
                    ElMessage.error('登录已过期，请重新登录');
                    window.location.href = '/#/';
                    break;
                case 403:
                    ElMessage.error('权限不足');
                    break;
                case 500:
                    ElMessage.error('服务器内部错误');
                    break;
                default:
                    ElMessage.error(error.response.data.message || '请求失败');
            }
        } else if (error.request) {
            // 请求已发出但没有收到响应
            ElMessage.error('网络连接异常');
        } else {
            // 其他错误
            ElMessage.error('请求异常');
        }
        
        return Promise.reject(error);
    }
);

export default http;