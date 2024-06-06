//search模块的小仓库

//引入接口函数 api中已经定义好了 直接用就可以获取对应的数据
import {reqGetSearchList} from "@/api";

export default {
	actions:{
		//获取搜索search模块数据
		async getSearchList({commit},params){
			let result = await reqGetSearchList(params);
			// console.log(result)
			if(result.code == 200){
				commit('GETSEARCGHLIST',result.data)
			}
		}
	},
	mutations:{
		GETSEARCGHLIST(state,searchList){
			state.searchList = searchList;
		}
	},
	state:{
		searchList:{}
	},
	//简化数据用的 类似于计算属性
	getters:{
		//将seahList中的数据单独拿出来
		////异步数据先显示初始数据，再显示带数据的数据
		//getters计算出的属性初始化获取的数据可能是undefined 控制台会报警告错误 
		//所以当getters没有获取到数据是 是一个空数组/空对象(主要看数据的数据类型是什么)
		goodsList(state){
			return state.searchList.goodsList || [];
		},
		attrsList(state){
			return state.searchList.attrsList || [];
		},
		trademarkList(state){
			return state.searchList.trademarkList || [];
		}
	},
}

