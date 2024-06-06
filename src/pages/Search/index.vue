<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread 面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <!-- 分类展示的是 你从首页点击传过来的分类名 如果有就进行展示 没有就不显示 -->
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i
                @click="removeCategoryName">×</i></li>

            <!-- 关键字keyword的面包屑 -->
            <!-- 关键字展示的是 从搜索框内传过来的关键字 如果有就进行展示 没有就不显示 -->
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyword">×</i></li>

            <!-- 品牌的面包屑 -->
            <!-- 品牌展示的是 从子组件searchSelect内传过来的品牌信息 如果有就进行展示 没有就不显示 -->
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(":")[1] }}<i @click="removeTrademarkName">×</i></li>
          
            <li class="with-x" v-for="(attr,index) in searchParams.props" :key="index">{{ attr.split(":")[1]}}<i @click="removeProps(index)">×</i></li>
          </ul>
        </div>

        <!--selector    给子组件定义一个自定义事件 用来获取品牌的信息  给子组件定义一个自定义事件 用来获取品牌属性的信息--> 
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{active:isOne}" @click="sort('1')">
                  <a>综合
                    <span 
                      v-show="isOne"
                      class="iconfont" 
                      :class="{'icon-shengxu':isAsc,'icon-jiangxu':isDesc}">
                    </span>
                    </a>
                </li>
                <li :class="{active:isTwo}" @click="sort('2')">
                  <a>价格
                    <span 
                      v-show="isTwo"
                      class="iconfont" 
                      :class="{'icon-shengxu':isAsc,'icon-jiangxu':isDesc}">
                    </span>
                    </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(goods, index) in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                     <!--商品的图片:需要路由跳转的时候,携带商品的ID-->
                    <router-link :to="`/detail/${goods.id}`">
                      <img v-lazy="goods.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ goods.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{ goods.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <!-- pageNo:当前第几页
               pageSize：每页显示多少条
               total：总共多少条
               continues：连续显示几个页码
           -->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" 
          :total="total" :continues="5"
          @getPageNo="getPageNo"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import SearchSelector from './SearchSelector/SearchSelector'
export default {
  name: 'Search',
  data() {
    return {
      //搜索search数据所需要的参数
      searchParams: {
        //产品id
        category1Id: '',
        category2Id: '',
        category3Id: '',
        // //产品名称
        categoryName: '',
        // //搜索的关键字
        keyword: '',
        // //平台属性的操作
        props: [],
        // //品牌
        trademark: '',
        // //排序
        order: '1:desc',
        // //第几页
        pageNo: 1,
        // //每一页展示的条数
        pageSize: 10,
      },
    }
  },

  //在组件挂载之前执行一次 (执行在monted之前 ) 主要用来获取路由参数
  beforeMount() {
    //在发请求之前 把接口要传递的参数获取到
    // 合并对象 将路由的query参数和params参数都合并到 searchParams对象中 然后传给后台
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  components: {
    SearchSelector
  },
  mounted() {
    // console.log(this.searchParams);
    //monted组件挂载完毕以后只会执行一次 所以当我们点击其他商品名称再次向服务器发请求时 服务器就接收不到参数了,
    //所以要借助watch来监视$route路由的变化 只要路由发生了变化就在向服务器发送一次请求
    //组件挂载完成时调用此方法 
    this.getSearchData()
  },
  computed: {
    //获取search数据中的商品数据
    ...mapGetters(['goodsList']),
    //获取search数据中商品的总数量
    ...mapState({
      total:(state)=>{
        return state.search.searchList.total
      }
    }),
    //排序
    isOne(){
      return this.searchParams.order.indexOf('1') !== -1
    },
    isTwo(){
      return this.searchParams.order.indexOf('2') !== -1
    },
    isAsc(){
      return this.searchParams.order.indexOf('asc') !== -1
    }, 
    isDesc(){
      return this.searchParams.order.indexOf('desc') !== -1
    },
  },
  methods: {
    //派发一个actions获取search搜索模块数据
    getSearchData() {
      this.$store.dispatch('getSearchList', this.searchParams)
    },

    //删除分类的面包屑 并且重新向服务器发起请求 重新渲染页面
    removeCategoryName() {
      // 优化
      //带给服务器的参数是可有可无的 但是属性值为空的字符串的也会发给服务器 这样增加了服务器性能
      //但是把相应的属性值变为undefined的话 当前这个属性就不会带给服务器
      this.searchParams.categoryName = undefined
      //把获取搜索数据的分类id也应该置空
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;

      //重新向服务器发起请求
      this.getSearchData();

      //删除分类名后 地址栏也需要更新 
      //直接让路由跳转到自身(search)
      //这里还要做一个判断 如果是query参数(三级列表数据传过来的)就删除 但如果是params参数(搜索框的参数)就不应该删除 路由跳转的时候应该带着
      if (this.$route.params) {
        //如果有params参数 则直接跳转到自身 并且把params参数带过去
        this.$router.push({ name: 'search', params: this.$route.params })
      }

      //删除后重新向服务器发送请求更新页面
      this.getSearchData();
    },

    //删除关键字的面包屑 并且重新向服务器发起请求 重新渲染页面
    removeKeyword() {
      //清空关键字参数
      this.searchParams.keyword = undefined;
      //重新向服务器发起请求
      this.getSearchData()

      //更新地址栏
      //如果是params参数(搜索框的参数)就删除 但如果是query参数(三级列表数据传过来的)就不应该删除 路由跳转的时候应该带着
      if (this.$route.query) {
        this.$router.push({ name: 'search', query: this.$route.query })
      }
       //删除了关键字以后 搜索框内的关键字也要被删除
      //触发Header组件的clearKeyword事件 清空输入框内容
      this.$bus.$emit('clearKeyword');
    },

    //点击品牌时 获取品牌数据(自定义事件)
    trademarkInfo(trademarkData) {
      // console.log("我是父组件", trademarkData)
      //trademark参数要获取的数据格式为:"ID:品牌名称"  示例: "1:苹果
      this.searchParams.trademark = `${trademarkData.tmId}:${trademarkData.tmName}`
      //重新向服务器发请求 渲染页面
      this.getSearchData()
    },

    //删除品牌面包屑 并且重新向服务器发起请求 重新渲染页面
    removeTrademarkName(){
      this.searchParams.trademark = undefined;
      this.getSearchData();
    },

    //点击商品数据 获取品牌属性数据(自定义事件)
    attrInfo(attr,attrValue){ 
      // console.log("我是父组件",attr,attrValue)
      //整理参数
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`
      //props参数要获取的数据格式为:["属性ID:属性值:属性名"]  示例: ["2:6.0～6.24 英寸:屏幕尺寸"]
      
     //数组去重 判断获取的属性是否已经有了 如果有了就不继续添加进数组 
      // if(this.searchParams.props.includes(prop)){
      //   //如果数组中有该元素 则不添加
      //   return false;
      // }else{
      //   //如果数组中没有该元素 则添加
      //   this.searchParams.props.push(prop);
      // }
        //数组去重方法二 如果在props中如果indexOf ==-1 name不存在 则添加 否则不添加
        if(this.searchParams.props.indexOf(prop) == -1){
        //  将数据存储在props数组中
        this.searchParams.props.push(prop);
      }
      //向服务器发送请求 渲染页面
      this.getSearchData();
    },

    //删除品牌属性面包屑 并且重新向服务器发起请求 重新渲染页面
    removeProps(index){
      //删除指定索引的属性
      this.searchParams.props.splice(index,1)
      //重新向服务器发起请求
      this.getSearchData();
    },

    //点击排序
     sort(flag){
      // flag 代表的是用户点击的是综合(1)还是价格(2)
      // 获取order的默认值 1:desc
      let originFlag = this.searchParams.order.split(":")[0];
      let originSortType = this.searchParams.order.split(":")[1];
      //准备一个新的数值，将来赋值给order
      let newOrder = "";
      //初始状态(第一次点击时) 判断是不是点击的综合
      if (flag == originFlag) {
        newOrder = `${originFlag}:${originSortType == "desc" ? "asc" : "desc"}`;
      } else {
        //初始状态(第一次点击时) 判断是不是点击的价格 点击的价格 将价格的flag传过来 
        //第一次点击的默认排序是desc 所以直接写死
        newOrder = `${flag}:desc`;
      }
      //重新给order赋予新的数值 order的值会变动 所以上面的originFlag 和 originSortType也都会变
      this.searchParams.order = newOrder;
      //重新发一次请求
      this.getSearchData();
    },

    //获取当前点击的页码(自定义事件回调)
    getPageNo(pageNo){
      this.searchParams.pageNo = pageNo;
      //向服务器发请求
      this.getSearchData()
      // console.log(this.searchParams.pageNo)
    }

  },
  watch: {
    //monted组件挂载完毕以后只会执行一次 所以当我们点击其他商品名称再次向服务器发请求时 服务器就接收不到参数了,
    //所以要借助watch来监视$route路由参数的变化 只要路由发生了变化就在向服务器发送一次请求
    $route(newValue, oldValue) {
      //路由参数发生改变以后就再次合并参数并向服务器发送请求
      Object.assign(this.searchParams, this.$route.query, this.$route.params);

      //向服务器发送请求获取最新数据
      this.getSearchData()

      //每一次请求完毕以后 应该把相应的1、2、3级分类的id清空 这样才能保证点击其他分类的时候 不会出现重复的数据
      this.searchParams.category1Id = '',
        this.searchParams.category2Id = '',
        this.searchParams.category3Id = ''
      //分类名字与关键字等其他数据不用清理 因为每一次路由发生变化都会赋予新值
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>