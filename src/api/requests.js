//对于axios进行二次封装
import axios from "axios";
//引入进度条
import nprogress from 'nprogress'
// //引入进度条样式
import 'nprogress/nprogress.css';

import store from "@/store"


const requests = axios.create({
     //基础路径,发请求URL携带api【发现:真实服务器接口都携带/api】如果有/api就可以省略不写
     baseURL: "/api",
     //超时的设置
     timeout: 5000,
})

//请求拦截器:在发请求之前，请求拦截器可以检测到，可以在发请求之前做一些事情
requests.interceptors.request.use(config => {
     //进度条在发起请求之前开始动
     nprogress.start();
     //判断仓库中是否存储了uuid(用户以游客身份登录的信息 也是用户的唯一标识)
     if(store.state.detail.uuid_token){
        config.headers.userTempId = store.state.detail.uuid_token
     } 

     //判断是否有token  如果有就把token放到请求头里面 需要携带token给服务器 服务器才会返回用户登录成功以后的用户信息
     if(store.state.user.token){
        config.headers.token = store.state.user.token
     }
    
    return config;
   
})


//响应拦截器
//响应拦截器可以检测到，可以在响应回来之后做一些事情
//响应成功回调
requests.interceptors.response.use(result=> {  
    //进度条在请求结束以后停止动
    nprogress.done() 
    return result.data
    //响应失败的回调
}, (err) => {
    return Promise.reject(err);
})

//最后需要暴露:暴露的是添加新的功能的axios,即为requests
export default requests;
