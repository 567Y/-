<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(cart, index) in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked=cart.isChecked @change="updateChecked(cart.skuId, $event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con3">
            <div class="item-txt">黑色版本</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('minus', -1, cart)">-</a>
            <input autocomplete="off" type="text" minnum="1" class="itxt" :value="cart.skuNum"
              @change="handler('itxt', $event.target.value, cart)">
            <a href="javascript:void(0)" class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCartById(cart.skuId)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>

      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked" @change="updateAllChecked" />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="#none" @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>{{ cartInfoList.length }}</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//按需引入 lodash 里的节流函数
import throttle from 'lodash/throttle'
import { mapGetters } from 'vuex';
export default {
  name: 'ShopCart',
  mounted() {
    this.getCartListDate()
  },
  methods: {
    //派发一个acitios 获取个人购物车数据
    getCartListDate() {
      this.$store.dispatch("getCartList")
    },
    //修改产品的个数[使用了节流的做法 500毫秒才能点击成功一次 不使用节流的话 当用户点击减的时候速度过快 会到负数去]
    handler: throttle(async function (type, disNum, cart) {
      //type:区别绑定同一个事件的三个元素
      //disNum: 每个点击元素的变化量
      //cart:区别点击的哪一个产品【cart上有产品的id】

      //最终是派发一个action 更新产品个数
      switch (type) {
        //点击的是加号
        case 'add':
          // 让当前产品的个数+1
          disNum = 1;
          break;
        //点击的是减号
        case 'minus':
          //只有产品个数大于1的情况下才能给服务器传递-1 让当前产品的个数-1
          if (cart.skuNum > 1) {
            disNum = -1;
          } else {
            disNum = 0;
          }
          break;
        //input框被改变
        case 'itxt':
          //用户输入的数是非法的 或者是负数 带给服务器的都为零
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            //正常情况下 用户输入的个数要减去产品原本的个数 才是带给服务器正确的变化量
            disNum = parseInt(disNum) - cart.skuNum
          }
          break;
      }

      //try catch是返回数据成功和失败的回调
      //执行成功的回调
      try {
        //修改成功以后向服务器发请求 
        //这里用async和await是 等待action那边的promise对象执行完毕 成功执行这里面代码 如果不写的话 每次点击后要手动刷新数据才会变化
        await this.$store.dispatch('addOrUpdateShopCart', {
          //产品id
          skuId: cart.skuId,
          //产品个数
          skuNum: disNum
        })
        //获取数据后更新服务器数据
        this.getCartListDate();

        //执行失败的回调
      } catch (error) {

      }

    }, 500),

    //删除购物车产品
    deleteCartById(skuId) {
      this.$store.dispatch('deleteCartBySkuId', skuId)
      //向服务器发请求 更新页面
      this.getCartListDate()
    },

    //删除选中的所有产品
    async deleteAllCheckedCart() {
      try {
        //派发一个action 在action中执行删除所选商品操作
        //这里用async和await是 等待action那边的promise对象执行完毕 成功执行这里面代码 如果不写的话 每次点击后要手动刷新数据才会变化
        await this.$store.dispatch('deleteAllChecked');
        //删除产品以后更新页面数据
        this.getCartListDate();
      } catch (error) {

      }
    },

    //切换商品的选中状态
    async updateChecked(skuId, event) {
      //服务器参数isChecked要的参数不是布尔值 是0|1 (0代表没选中 1代表选中)
      let checked = event.target.checked ? 1 : 0;
      try {
        //派发一个action 更新产品选中状态
        await this.$store.dispatch('updateChecked', { skuId: skuId, isChecked: checked })
        //获取数据后更新服务器数据
        this.getCartListDate();
      } catch (error) {
        alert(error.message)
      }
    },

    //全选所有商品
    async updateAllChecked(event) {
      let isChecked = event.target.checked ? 1 : 0;
      try {
        //派发一个action请求 在action中执行删除所选商品操作
        await this.$store.dispatch('updateAllChecked', isChecked);
        //更新所有商品的选中状态
        this.getCartListDate();
      } catch (error) {

      }


    }



  },
  computed: {
    //购物车数据
    ...mapGetters(['cartList']),
    //将购物车数据简化出来
    cartInfoList() {
      return this.cartList.cartInfoList || []
    },
    //计算商品总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach(item => {
        sum += item.skuPrice * item.skuNum;
      })
      return sum;
    },
    //所有产品都选中 全选按钮就选中
    isAllChecked() {
      //every:遍历数组里的元素，只要全部元素isChecked属性都为1那么就返回true
      // 有一个不是1那么就为false
      return this.cartInfoList.every(item => item.isChecked == 1)
    }
  },
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 4.1667%;
        }

        .cart-list-con2 {
          width: 25%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con3 {
          width: 20.8333%;

          .item-txt {
            text-align: center;
          }
        }

        .cart-list-con4 {
          width: 12.5%;

        }

        .cart-list-con5 {
          width: 12.5%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 12.5%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 12.5%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
