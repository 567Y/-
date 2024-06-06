import { reqUserAddress,reqOrderInfo } from "@/api";

const state = {
    addressInfo:[],
    orderInfo:{}
};
const actions = {
    async userAddressInfo(context){
        let res = await reqUserAddress();
        console.log(res.data)
        if(res.code == 200){
            context.commit('USERADDRESSINFO',res.data)
        }
    },
    async orderInfo(context){
        let res = await reqOrderInfo();
        if(res.code == 200){
            context.commit('ORDERINFO',res.data)
        }
    }
};
const mutations = {
    USERADDRESSINFO(state,addressInfo){
        state.addressInfo = addressInfo;
    },
    ORDERINFO(state,orderInfo){
        state.orderInfo = orderInfo;
    }

};
const getters = {};

export default{
    state,
    actions,
    mutations,
    getters
}