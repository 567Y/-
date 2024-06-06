//建立存储商品详情的数据

//引入接口数据
import {reqGetGoodsList,reqAddOrUpdateShopCart} from '@/api'
import {getUUID} from "@/utils/uuid_token"

const state = {
    goodsInfo:{},
    //游客临时身份uuid(生成一个随机id且不会变了)
    uuid_token:getUUID()
};
const actions = {
   async getGoodsList({commit},skuId){
     let res = await reqGetGoodsList(skuId);
    //  console.log(res)
     if(res.code == 200){
        commit("GETGOODSLIST",res.data)
     }
    },
    async addOrUpdateShopCart({commit},{skuId,skuNum}){
        //这里返回的的数据只是一个成功或失败的提示 所以不用将数据存储在仓库中了
       let result = await reqAddOrUpdateShopCart(skuId,skuNum);
       //async返回的一定是一个Promise对象 所以可以根据Promise对象的成功和失败的方法来判断是否成功
      if(result.code == 200){
        return "ok"
      }else Promise.reject(new Error("faile"))
    }   
};
const mutations = {
    GETGOODSLIST(state,goodsInfo){
        state.goodsInfo = goodsInfo;
    },
};

const getters = {
    //getters计算出的属性初始化获取的数据可能是undefined 控制台会报警告错误 
	//所以当getters没有获取到数据是 是一个空数组/空对象(主要看数据的数据类型是什么)
    //简化路径导航的数据
    categoryView(state){
       return state.goodsInfo.categoryView || {}
    },
    //简化产品信息的数据
    skuInfo(state){
        return state.goodsInfo.skuInfo || {}
    },
    //简化产品售卖属性
    skuSaleAttrValueList(state){
        return state.goodsInfo.spuSaleAttrList || {}
    }
};

export default {
    state,
    actions,
    mutations,
    getters
}