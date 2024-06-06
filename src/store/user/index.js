//注册和登录模块小仓库

import { reqGetCode,reqUserRegister,reqUserLogin,reqUserInfo,reqUserLogout} from "@/api";
const state = {
    code:'',
    token:localStorage.getItem("token") || '',
    userInfo:{},
};
const actions = {
    //获取注册信息的验证码
    async getcode({commit},phone) {
        // console.log(phone)
        let res = await reqGetCode(phone);
        // console.log(res)
        if(res.code == 200){
            commit('GETCODE',res.data);
            return 'ok'
        }else{
            return Promise.reject(res.msg);
        }
    },
    //用户注册
   async userRegister(context,regInfo){
        console.log(regInfo)
        let res = await reqUserRegister(regInfo);
        // console.log(res)
        console.log(res)
        if(res.code == 200){
            return 'ok';
        }else{
            Promise.reject(new Error(res.msg))
        }
    },

    //用户登录
    async userLogin(context,loginInfo){
        let res = await reqUserLogin(loginInfo)
        console.log(res)
        if(res.code == 200){
            //保存token到vuex
            //token:是用户唯一的标识符
           context.commit('USERLOGIN',res.data.token)
           //将用户登录的token持久化存储到本地存储中
           localStorage.setItem('token',res.data.token);
            return 'ok'
        }else{
           return res.message;
        }
    },
    //获取用户登录后的用户信息
    async getUserInfo(context){
        let res = await reqUserInfo();
        //如果登录以后进入home首页 信息显示未登录是因为没有token token是用户的唯一标识 所以要在请求拦截器中加入token
        // console.log(res)
        if(res.code == 200){
            context.commit("GETUSERINFO",res.data)
        }
    },

    //点击退出登录 清空用户信息
    async clearUserInfo(context){
        let res = await reqUserLogout();
        if(res.code == 200){
            context.commit("CLEARUSERINFO");
            return 'ok'
        }else{
            Promise.reject(new Error(res.msg));
        }
    }


};
const mutations = {
    GETCODE(state, data){
        state.code = data;
    },
    USERLOGIN(state, token){
        state.token = token;
    },
    GETUSERINFO(state,userInfo){
        state.userInfo = userInfo
    },
    CLEARUSERINFO(state){
        //把仓库中用户相关信息清空
        state.token = '';
        state.userInfo = {};
        //清空用户token
        localStorage.removeItem('token');
    }

};
const getters = {};
export default {
    state,
    actions,
    mutations,
    getters
}