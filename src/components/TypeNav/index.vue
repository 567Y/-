<template>
    <div class="type-nav">
        <div class="container" @mouseleave="hide" >
            <h2 class="all" @mouseenter="enterShow">全部商品分类</h2>
            <nav class="nav">
                <a href="###">服装城</a>
                <a href="###">美妆馆</a>
                <a href="###">乐优购超市</a>
                <a href="###">全球购</a>
                <a href="###">闪购</a>
                <a href="###">团购</a>
                <a href="###">有趣</a>
                <a href="###">秒杀</a>
            </nav>
              <!-- 过度动画效果 -->
              <transition name="sort">
            <!-- 三级分类 -->
            <div class="sort" v-show="isShow">
                <div class="all-sort-list2" @click="goSearch">
                    <!-- 一级分类 -->
                    <div class="item" v-for="(c1, index) in caregoryList" :key="c1.categoryId"
                        :class="{ cur: currentIndex == index }">
                        <h3 @mouseenter="show(index)">
                            <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{ c1.categoryName
                            }}</a>
                        </h3>
                        <div class="item-list clearfix">
                            <div class="subitem" v-for="(c2, index) in c1.categoryChild" :key="c2.categoryId">
                                <dl class="fore">
                                    <dt>
                                        <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{
                                            c2.categoryName }}</a>
                                    </dt>
                                    <dd>
                                        <em v-for="(c3, index) in c2.categoryChild" :key="c3.categoryId">
                                            <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId">{{
                                                c3.categoryName }}</a>
                                        </em>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        </div>
    </div>
</template>

<script>
//引入动画库
// import 'animate.css'

import { mapState } from 'vuex'
//引入lodash库
import _ from 'lodash';
/* eslint-disable */
export default {
    name: 'TypeNav',
    data() {
        return {
            currentIndex: null,
            isShow: true
        }
    },
    //组件挂载完毕 向服务器发请求
    mounted() {
        //向vuex派发一个actions获取三级列表的数据
        this.$store.dispatch("caregoryList");
        //当组件挂载完毕时 让在search模块的三级联动效果隐藏 在home模块的三级联动显示
        if (this.$route.path == "/home") {
            this.isShow = true;
        } else if (this.$route.path == "/search") {
            this.isShow = false;
        }else if (this.$route.name == "detail") {
            this.isShow = false;
        }
    },
    computed: {
        //获取模块式开发vuex中的home仓库中的数据
        ...mapState({
            //state参数代表的是大仓库中的数据 所以要分别读取到对应数据
            caregoryList: (state) => {
                return state.home.caregoryList
            }
        })
    },
    methods: {
        //鼠标移入移出一级分类菜单动态显示背景颜色
        //使用节流做法
        show: _.throttle(function (index) {
            this.currentIndex = index
        }, 50),
        hide() {
            this.currentIndex = null;
             //这里是在search模块中 鼠标移出隐藏 在home模块中不会触发
             if(this.$route.path == '/search' || this.$route.name == 'detail'){
                this.isShow = false;
            }
        },
        // 利用编程式导航和事件委托方法进行跳转search路由
        goSearch(event) {
            //获取点击的元素
            let element = event.target;
            //给一、二、三级分类的a标签设置一个categoryName自定义属性 这样就可以区分点击的一定是要跳转的a标签
            //(自定义属性你写的大写 浏览器都会解析成小写 所以要用的话必须写小写)
            //dataset可以获取自定义属性与属性值
            //利用解构赋值 分别获取到自定义属性  通过category1id,category2id,category3id自定义属性去区分一、二、三级分类
            let { categoryname, category1id, category2id, category3id } = element.dataset;
            // console.log(element.dataset)

            //如果标签上有categoryname自定义属性就一定是a标签 因为只有a标签才会有这个自定义属性
            if (categoryname) {
                //要跳转的路由
                let location = { name: "search" };
                //整理跳转search路由的参数
                let query = { categoryName: categoryname }
                if (category1id) {
                    query.category1Id = category1id;
                } else if (category2id) {
                    query.category2Id = category2id;
                } else {
                    query.category3Id = category3id;
                }
                //合并参数
                //这里是判断路由中是否还包含params参数 如果包含就和query参数一起传过去
                //如果不包含params参数 直接将query参数传递过去
                //params参数是搜索栏所传递的参数
                if(this.$route.params){
                    location.params = this.$route.params;
                    location.query = query;
                    this.$router.push(location)
                }
                
            }

        },
         //鼠标进入时三级联动效果展示(是给search模块的应用)
         enterShow(){
            this.isShow = true;
        }
    }
}
</script>

<style scoped lang="less">
   
.type-nav {
    .cur {
        background-color: skyblue;
    }

    border-bottom: 2px solid #e1251b;

    .container {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        position: relative;

        .all {
            width: 210px;
            height: 45px;
            background-color: #e1251b;
            line-height: 45px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }

        .nav {
            a {
                height: 45px;
                margin: 0 22px;
                line-height: 45px;
                font-size: 16px;
                color: #333;
            }
        }

        .sort {
            position: absolute;
            left: 0;
            top: 45px;
            width: 210px;
            // height: 461px;
            height: 500px;
            position: absolute;
            background: #fafafa;
            z-index: 999;

            .all-sort-list2 {
                .item {
                    h3 {
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: 400;
                        overflow: hidden;
                        padding: 0 20px;
                        margin: 0;

                        a {
                            color: #333;
                        }
                    }

                    .item-list {
                        display: none;
                        position: absolute;
                        width: 734px;
                        min-height: 460px;
                        background: #f7f7f7;
                        left: 210px;
                        border: 1px solid #ddd;
                        top: 0;
                        z-index: 9999 !important;

                        .subitem {
                            float: left;
                            width: 650px;
                            padding: 0 4px 0 8px;

                            dl {
                                border-top: 1px solid #eee;
                                padding: 6px 0;
                                overflow: hidden;
                                zoom: 1;

                                &.fore {
                                    border-top: 0;
                                }

                                dt {
                                    float: left;
                                    width: 54px;
                                    line-height: 22px;
                                    text-align: right;
                                    padding: 3px 6px 0 0;
                                    font-weight: 700;
                                }

                                dd {
                                    float: left;
                                    width: 415px;
                                    padding: 3px 0 0;
                                    overflow: hidden;

                                    em {
                                        float: left;
                                        height: 14px;
                                        line-height: 14px;
                                        padding: 0 8px;
                                        margin-top: 5px;
                                        border-left: 1px solid #ccc;
                                    }
                                }
                            }
                        }
                    }

                    &:hover {
                        .item-list {
                            display: block;
                        }
                    }
                }
            }
        }
         // 过度动画开始的状态(进入的起点)
    .sort-enter{
       height: 0;
    }
    /* 过度效果 动画效果在2s内完成 */
    .sort-enter-active, .sort-leave-active{
        transition:all .5s linear;
    }

    //过度动画结束的状态(进入的终点)  
    .sort-enter-to, .sort-leave-to{
        height: 461px;
    }

    //离开的动画效果
    //离开的起点
    .sort-leave{
        height: 461px;
    }

    //离开的终点
    .sort-leave-to{
        height: 0;
    }
    }
}
</style>