import Vue from 'vue'
import App from './App.vue'
//按需引入elementUI
import { Button,MessageBox} from 'element-ui';


//elementUl注册组件
// 方式一：全局注册
Vue.component(Button.name, Button);
Vue.component(MessageBox.name, MessageBox);
//方式二：
// Vue.use(Button);

// Vue.use(Select)                                        
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt


//全局组件
//三级联动组件--全局组件
import TypeNav from "@/components/TypeNav"
//分页器的全局组件
import Pagination from "@/components/Pagination"
//全局注册  第一个参数:全局组件的名字 第二个参数:哪一个组件
Vue.component(TypeNav.name,TypeNav)
Vue.component(Pagination.name,Pagination);

//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
//应用插件
Vue.use(VueRouter)

//引入swiper样式 因为后面还会有组件用到swiper样式 所以直接全局引入
import "swiper/css/swiper.min.css"

//引入仓库
import store from './store';

//引入mockServe文件,让咱们模拟接口跑起来
import "@/mock/mockServe.js";

//统一引入接口api文件夹内的全部请求接口函数 这样每个组件调用接口函数就不用直接引入了
import * as API from "@/api";

//引入图片懒加载插件
import VueLazyload from 'vue-lazyload'

//引用懒加载的图片
import photo from "@/assets/1.gif";

//使用(注册)插件
Vue.use(VueLazyload, {
	//懒加载失败时的图片
	// error: errorimage,
	//懒加载加载时的图片
	loading: photo,
  })

Vue.config.productionTip = false

const vm = new Vue({
  render: h => h(App),
  router,
  store,
  	//给所有的vc绑定一个自定义事件 
	beforeCreate(){
		//this指vm 
		// vm和vc的内置关系中 组件实例对象（vc）可以访问到 Vue原型上的属性、方法 (VueComponent.prototype.__proto__ === Vue.prototype)
		// 所以vc可以访问到Vue原型上的属性 使用这个属性就可以实现任意组件之间的通信
		Vue.prototype.$bus = this //安装全局事件总线
		//把接口函数挂载到Vue原型上
		Vue.prototype.$API = API;
	},
}).$mount('#app')
 