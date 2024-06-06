 //这个文件主要对接口进行统一管理 所有接口文件都可以在这里写入
 
 //引入二次封装的axios
 import requests from "@/api/requests"
 //引入mock数据的axios
 import mockRequests from '@/api/mockRequest';


 //获取三级列表数据
 export const reqCategoryList = () => {
    //调用三级联动接口数据 并将获取到的数据返回出去(返回的结果是promise对象)
    return requests({url:'/api/product/getBaseCategoryList',method:'get'})
}


//获取轮播图数据(mock出的数据相当于自己写的接口 可以直接拿来使用 不会向后台发送请求)
export const reqGetBannerList = ()=> mockRequests.get('/banner')

//获取floor楼层数据 (mock出的数据)
export const reqGetFloorList = ()=>mockRequests.get("/floor");

//获取搜索search数据 
// export const reqGetSearchList = (params)=> requests({
//     url:'/api/list',
//     method:'post',
//     data:params
// })
export const reqGetSearchList = (params)=>{
    return requests({url:'/api/list',method:'post',data:params})
}

//获取商品详情数据
export const reqGetGoodsList = (skuId) =>{
    return requests({
        url:`/api/item/${skuId}`,
        method:"get"
    })
}

//将产品添加到购物车中(或者更新某一个产品的个数) 返回产品id和产品个数
export const reqAddOrUpdateShopCart = (skuId,skuNum)=> requests({
    url:`/api/cart/addToCart/${ skuId }/${ skuNum }`,
    method:'post'
})

//获取个人购物车数据
export const reqCartList = ()=> requests({url:'/api/cart/cartList', method:'GET'})
//删除购物车产品
export const reqDeleteCartById = (skuId)=> requests({url:`/api/cart/deleteCart/${skuId}`,method:'DELETE'})

//切换购物车商品的选中状态
export const reqUpdateCheckedById = (skuId,isChecked) => requests({url:`/api/cart/checkCart/${skuId}/${isChecked}`,method:'get'})

//注册页获取验证码
export const reqGetCode = (phone)=> requests({url:`/api/user/passport/sendCode/${phone}`,method:'get'});

//用户注册信息  (登录信息为 用户名、手机号、密码 直接用一个对象代替)                                 key:val一致省略val
export const reqUserRegister = (data)=>requests({url:'/api/user/passport/register',method:'post',data});

//用户登录信息
export const reqUserLogin = (data)=>requests({url:'/api/user/passport/login',data,method:'post'})

//获取用户登录后的用户信息
export const reqUserInfo = ()=>requests({url:'/api/user/passport/auth/getUserInfo',method:'get'});

//退出登录
export const reqUserLogout = ()=>requests({url:'/api/user/passport/logout',method:'get'})

//获取用户地址信息
export const reqUserAddress = ()=>requests({url:'/api/user/userAddress/auth/findUserAddressList',method:'get'})

//获取订单交易信息
export const reqOrderInfo = ()=>requests({url:'/api/order/auth/trade',method:'get'})

//获取提交订单列表信息          tradeNo  订单编号    data  订单信息(一共有六个参数 到时候提交为对象形式就行了)
export const reqSubmitOrder = (tradeNo,data) => requests({url:`/api/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'});

//获取订单支付信息
export const reqPayInfo = (orderId) => requests({url:`/api/payment/weixin/createNative/${orderId}`,method:'get'})

//获取支付订单状态(成功或失败)
export const reqPayStatus = (orderId) => requests({url:`/api/payment/weixin/queryPayStatus/${orderId}`,method:'get'});

//获取个人订单列表数据 page:页码 limit:每页显示的条数
export const reqMyOrder = (page,limit) => requests({url:`/api/order/auth/${page}/${limit}`,method:'get'});
