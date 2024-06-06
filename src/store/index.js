import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


//引入小仓库
import home from '@/store/home'
import search from "@/store/search"
import detail from "@/store/detail"
import shopcart from "@/store/shopcart"
import user from "@/store/user"
import trade from "@/store/trade"
//创建并暴露store
export default new Vuex.Store({
    //实现Vuex仓库模块式开发存储数据
    modules: {
        home,
        search,
        detail,
        shopcart,
        user,
        trade,
    }
})