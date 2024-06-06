
// //引入路由组件
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Search from "@/pages/Search"
import Detail from "@/pages/Detail"
import AddCartSuccess from "@/pages/AddCartSuccess"
import shopCart from "@/pages/ShopCart"
import Trade from "@/pages/Trade"
import Pay from "@/pages/Pay"
import PaySuccess from "@/pages/PaySuccess"
import Center from "@/pages/Center"
//二级路由
import myOrder from "@/pages/Center/myOrder"
import groupOrder from "@/pages/Center/groupOrder"

export default[
    {
        path:'/center',
        component:Center,
        meta:{show:true},
        //二级路由
        children:[
            {
                //子路由写路径是不用带/的
                path:'myorder',
                component:myOrder,
            },
            {
                path:'grouporder',
                component:groupOrder,
            },
            //重定向 在center路由组件时 默认进入myorder路由组件
            {
                path:'/center',
                redirect:'/center/myorder'
            }
        ]
    },
    {
        path:'/paysuccess',
        component:PaySuccess,
        name:'paysuccess',
        meta:{show:true},
        beforeEnter:(to,from,next)=>{
            if(from.path == '/pay'){
                next();
            }else{
                next(false);
            }
        }
    },
    {
        path:'/pay',
        component:Pay,
        name:'pay',
        meta:{show:true},
        beforeEnter:(to,from,next)=>{
            //是为了如果手动进入支付页面(pay)是不能进入的 只能从交易页面(trade)进入pay路由
            //如果是从shopcart路由进入trade路由就可以放行
            if(from.path == '/trade'){
                next()
            }else{
                next(false);
            }
        }
    },
    {
        path:'/trade',
        component:Trade,
        name:'trade',
        meta:{show:true},
        //独享路由守卫
        beforeEnter:(to,from,next)=>{
            //是为了如果手动进入交易页面(trade)是不能进入的 只能从购物车(shopcart)页面进入trade路由
            //如果是从shopcart路由进入trade路由就可以放行
            if(from.path == '/shopcart'){
                next();
            }else{
                //表示不是从shopcart路由组件进入的trade
                //next(false)表示从哪个路由进入的最终还是停留在该路由中
                next(false);
            }
        }
    },
    {
        path:'/shopcart',
        component:shopCart,
        name:'shopcart',
        meta:{show:true}

    },
    {
        path:"/addCartSuccess",
        component:AddCartSuccess,
        name:"addCartSuccess",
        meta:{show:true}
    },
    {
        path:'/detail/:skuid?',
        component:Detail,
        name:"detail",
        //路由元信息,控制当前路由是否需要Footer组件
        meta:{show:true}
    },
    {
        path:'/home',
        component:Home,
        meta:{show:true}
    },
    {
        path:'/login',
        component:Login,
        meta:{show:false}    
    },
    {
        path:'/register',
        component:Register,
        meta:{show:false}
    },
    {
        name:'search',
        path:'/search/:keyword?',
        component:Search,
        meta:{show:true}
    },
    //重定向 在项目跑起来的时候，访问/时 立马让它定向到首页
    {
        path:'*',
        redirect:'/home'
    }
]