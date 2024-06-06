import { reqCartList,reqDeleteCartById,reqUpdateCheckedById } from "@/api";

const state = {
    cartList:[],
};
const actions = {
    //获取购物车数据
    async getCartList({commit}){
       let res = await reqCartList();
    //    console.log(res)
       if(res.code == 200){
        commit("GETCARTLIST",res.data)
       }
    },
    //删除购物车商品
    async deleteCartBySkuId({commit},skuId){
        let res = await reqDeleteCartById(skuId);
        //由于该接口没有返回的数据 所以自己写一个判断成功和失败的回调
       if(res.code == 200){
        return 'ok'
       }else{
       return Promise.reject(new Error('faile'))
       }
    },
    //修改购物车商品选中状态
    async updateChecked({commit},{skuId,isChecked}){
        let res = await reqUpdateCheckedById(skuId,isChecked);
        // console.log(res)
        if(res.code == 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    },

    //删除所选购物车的商品
    deleteAllChecked(context){
        let promiseArr = [];
        //获取购物车商品数据 将所有商品数据都进行循环 然后在循环中删除被选中的商品
        context.getters.cartList.cartInfoList.forEach(item => {
            //判断一下商品数据中的isChecked属性是否是1(1是选中状态 0是未选中状态)
            //如果为1 就调用删除购物车商品的action
           let promise =  item.isChecked == 1?context.dispatch('deleteCartBySkuId',item.skuId):'';
            promiseArr.push(promise);
        });
        //返回成功的结果 Promise.all()方法可以将多个Promise实例包装成一个新的Promise实例 如果有一个失败 返回的结果就是失败
        return Promise.all(promiseArr)
    },

    //全选购物车商品
    updateAllChecked(context,isChecked){
        context.getters.cartList.cartInfoList.forEach(item=>{
            context.dispatch('updateChecked',{skuId:item.skuId,isChecked});
        });
    }

};
const mutations = {
    GETCARTLIST(state,cartList){
        state.cartList = cartList
    }
};
const getters = {
    cartList(state){
       return state.cartList[0] || {}
    }
};

export default{
    state,
    actions,
    mutations,
    getters
}