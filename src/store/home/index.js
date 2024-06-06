//home模块的小仓库

import {reqCategoryList,reqGetBannerList,reqGetFloorList} from "@/api"

export default {
	//  响应组件中用户的动作
	actions:{
		async caregoryList({commit}){
			let res =  await reqCategoryList()
			if(res.code == 200){
				commit("CAREGORYLIST",res.data)
			}
		},
		// async caregoryList(context,value){
		// 	let res = await reqCategoryList();
		// 	if(res.code == 200){
		// 		context.commit("CAREGORYLIST",res.data)
		// 	}
		// },
		//获取轮播图数据
		async getBannerList({commit}){
			let res = await reqGetBannerList()
			// console.log(result)
			if(res.code == 200){
				commit("GETBANNERLIST",res.data);
			}
		},
		//获取floor楼层数据
		async getFloorList({commit}){
			 let res = await reqGetFloorList();
			//  console.log(res)
			 if(res.code == 200){
				commit("GETFLOORLIST",res.data)
			 }
		},

	},
	// //修改state中的数据
	mutations:{
		//三级列表数据
		CAREGORYLIST(state,caregoryList){
			state.caregoryList = caregoryList
		},
		// 轮播图数据
		GETBANNERLIST(state,bannerList){
			state.bannerList = bannerList;
		},
		//floor楼层数据
		GETFLOORLIST(state,floorList){
			state.floorList = floorList;
		}
		
	},
	// //仓库存储数据的地方
	state:{
		caregoryList:[],
		bannerList:[],
		floorList:[]
	},
	// // 当state中的数据需要经过加工后再使用时，可以使用getters加工 类似于计算属性
	getters:{},
}