//配置路由信息的地方
//引入vue
import Vue from 'vue'
//引入Router 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router';
//使用插件
Vue.use(VueRouter);
//引入路由信息
import routes from "@/router/routes"

//引入store仓库信息
import store from '@/store';

//解决编程式导航点击多次报错的现象    实现原理:重写push方法
//把人家原型对象的push方法进行保存
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//VueRouter.prototype原型对象添加一个方法
//location:路由跳转相关的信息
VueRouter.prototype.push = function (location, resolve, reject) {
    //当前函数this：即为VueRouter类的实例
    //相当于push方法里面this，是windows【完犊子了】
    //利用人家push方法实现路由跳转，保证push里面this,应该vueRouter类的实例

    //面试:函数apply与call区别?
    //相同的地方:都可以篡改函数里面this
    //不同的地方:apply传递参数 数组  call传递参数 逗号分割

    if (resolve && reject) {
        //代表真:代表着两个形参接受参数【箭头函数】
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => { }, () => { });
    }
}


//配置路由信息并导出
const router = new VueRouter({
    routes,
    //滚动行为
    scrollBehavior(to, from, savePosition) { // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
        // console.log(to) // to：要进入的目标路由对象，到哪里去
        // console.log(from) // from：离开的路由对象，哪里来
        // console.log(savePosition) // savePosition：会记录滚动条的坐标，点击前进/后退的时候记录值{x:?,y:?}
        //在切换导航的时候滚动条的y轴在最上方(可设x、y轴)
        return { y: 0 }
    }
})

export default router;
// to:即将要进入的目标（路由对象）
// ​from:当前导航正要离开的路由  
// next() 直接放行  // next('/路径名') 跳转到指定页面

//全局前置守卫：初始化时执行、每次路由切换前执行
router.beforeEach(async (to, from, next) => {
    // console.log(to, from)
    //获取用户登录的token(用户登录了才会有token)
    const token = store.state.user.token;
    //获取用户名
    const userName = store.state.user.userInfo.loginName;

    if (token) {//有了token的情况下(用户已经登录了)
        if (to.path == '/login') {//判断是否去的登录路由 如果是那么就返回到home首页(因为登录成功了以后是不能去登录路由的)
            next("/")
        } else { //没有去登录路由 那么就放行
            //判断登录成功以后是否有用户名
            if (userName) {
                next(); //有用户名就放行
            } else {
                // (这里是因为刷新以后用户名会消失 所以在判断一下如果没有用户名的情况下就在派发action获取一次用户信息)
                try {
                    await store.dispatch("getUserInfo");
                    next();
                } catch (error) {
                    //用户的token过期了(失效了)那么就要清除用户信息 然后跳转到login登录路由 重新登录
                    //在一般的网站信息中 如果第一次登录成功了 但是过一段时间再次进入该网站时 token就有可能会失效
                    //清除用户信息
                    await store.dispatch('clearUserInfo')
                    //跳转到登录页
                    next("/login");
                }
            }
        }
    }else{//没有token的情况下(用户没有登录)
        //在未登录的情况下 不能去交易页面(trade)、支付页面(pay,paysuccess)、不能去个人订单页面(center)
        let toPath = to.path;
        // console.log(toPath);
        if(toPath == '/trade' ||toPath == '/pay' || toPath == '/paysuccess' || toPath == '/center/myorder'){
            //在未登录的情况下 去了不能去的页面 加了?redirect="+toPath之后 不能去的页面会被放到query参数里面
            next("/login?redirect=" + toPath)
       }else{
            //去的不是上面这些路由就放行
            next();
       }
    }
})