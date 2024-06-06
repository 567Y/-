//引入uuid
import {v4 as uuidv4} from "uuid";
//封装函数:只能生成一次用户临时身份
let uuid_token;
//生成一个随机字符串，且每次执行不能发生改变 游客身份持久存储
export const getUUID = ()=>{
    //先从本地存储获取uuid(看一下本地存储是否有)
    uuid_token = localStorage.getItem("uuidtoken")
    if(!uuid_token){
        //如果没有就生成游客临时身份
        uuid_token = uuidv4();
        //本地存储一次
        localStorage.setItem("uuidtoken",uuid_token);
    }
    return uuid_token
}