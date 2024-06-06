<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{ orderId }}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{ payInfo.totalFee }}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>乐优购商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg"></li>
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg"></li>
              <li><img src="./images/pay11.jpg"></li>
              <li><img src="./images/pay12.jpg"></li>
              <li><img src="./images/pay13.jpg"></li>
              <li><img src="./images/pay14.jpg"></li>
              <li><img src="./images/pay15.jpg"></li>
              <li><img src="./images/pay16.jpg"></li>
              <li><img src="./images/pay17.jpg"></li>
              <li><img src="./images/pay18.jpg"></li>
              <li><img src="./images/pay19.jpg"></li>
              <li><img src="./images/pay20.jpg"></li>
              <li><img src="./images/pay21.jpg"></li>
              <li><img src="./images/pay22.jpg"></li>

            </ul>
          </div>

        </div>
        <div class="hr"></div>

        <div class="submit">
          <a @click="open" class="btn">立即支付</a>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//引入生成二维码的插件
import QRCode from 'qrcode';
export default {
  name: 'Pay',
  data() {
    return {
      //接收支付信息数据
      payInfo: {},
      //支付状态的定时器
      timer: null,
      code: null,
    }
  },
  mounted() {
    //因为mounted生命周期不能使用async|await 所以直接将接口写在方法内
    this.getPayInfo();
  },
  computed: {
    //订单编号
    orderId() {
      return this.$route.query.orderId
    }
  },
  methods: {
    //获取支付信息接口
    async getPayInfo() {
      let res = await this.$API.reqPayInfo(this.orderId)
      if (res.code == 200) {
        //将获取的数据存入payInfo变量中
        this.payInfo = res.data
        // console.log(this.payInfo)
      }
    },
    //弹出框
    async open() {
      //生成二维码(url值)  QRCode.toDataURL(text) 里面放二维码的url
      //返回的是一个promise值 要用async和await获取值
      let url = await QRCode.toDataURL(this.payInfo.codeUrl)
      this.$alert(`<img src=${url} />`, "请使用微信支付", {
        //成功按钮的文本内容
        confirmButtonText: '已成功支付',
        //取消按钮的文本内容
        cancelButtonText: "支付常见问题",
        center: true,
        //是否显示取消按钮
        showCancelButton: true,
        //识别html标签
        dangerouslyUseHTMLString: true,
        // 是否显示右上角关闭按钮
        showClose: false,
        //关闭弹出框前的回调 会暂停关闭的实例(弹出框不能被关闭了要用参数里的done()来关闭) 用参数配置项来控制
        beforeClose: (type, instance, done) => {
          //type: 用于区分取消|确定按钮  确认按钮为confirm 取消按钮为cancel
          //instance: 当前弹出框的实例(组件实例对象)
          //done: 用于关闭弹出框的函数(方法)

          //点击了取消按钮  关闭弹出框
          if (type == 'cancel') {
            //清除定时器
            clearInterval(this.timer)
            this.timer = null;
            //点击取消按钮  关闭弹出框
            done();
          } else if (type == 'confirm') {
            //判断是否已经支付了
            // if (this.code == 200) {
              //清除定时器
              clearInterval(this.timer)
              this.timer = null;
              //跳转到支付成功页面
              this.$router.push('/paysuccess')
            // }
            //点击了确认按钮  关闭弹出框
            done();
          }
        },
      });

      //要判断支付是否成功 成功了要跳转路由
      //判断是否有定时器 没有就开启一个新定时器
      if (!this.timer) {
        //让支付接口一秒钟执行一次 
        this.timer = setInterval(async () => {
          //调用支付状态接口   刚调用接口时 code是205(失败状态) 当支付成功以后code == 200(成功状态)
          let res = await this.$API.reqPayStatus(this.orderId);
          // console.log(res)
        
          //如果支付成功那么就将定时器销毁
          if (res.code == 200) {
            //清除定时器
            clearInterval(this.timer)
            this.timer = null;
            //保存支付成功返回的code
            this.code = res.code;
            //关闭弹出框
            this.$msgbox.close();
            //跳转到支付成功页面
            this.$router.push('/paysuccess')
          }
        }, 1000)
      }
    }

  }
}
</script>

<style lang="less" scoped>
.pay-main {
  margin-bottom: 20px;

  .pay-container {
    margin: 0 auto;
    width: 1200px;

    a:hover {
      color: #4cb9fc;
    }

    .orange {
      color: #e1251b;
    }

    .money {
      font-size: 18px;
    }

    .zfb {
      color: #e1251b;
      font-weight: 700;
    }

    .checkout-tit {
      padding: 10px;

      .tit-txt {
        font-size: 14px;
        line-height: 21px;

        .success-icon {
          width: 30px;
          height: 30px;
          display: inline-block;
          background: url(./images/icon.png) no-repeat 0 0;
        }

        .success-info {
          padding: 0 8px;
          line-height: 30px;
          vertical-align: top;
        }
      }

      .paymark {
        overflow: hidden;
        line-height: 26px;
        text-indent: 38px;

        .fl {
          float: left;
        }

        .fr {
          float: right;

          .lead {
            margin-bottom: 18px;
            font-size: 15px;
            font-weight: 400;
            line-height: 22.5px;
          }
        }
      }
    }

    .checkout-info {
      padding-left: 25px;
      padding-bottom: 15px;
      margin-bottom: 10px;
      border: 2px solid #e1251b;

      h4 {
        margin: 9px 0;
        font-size: 14px;
        line-height: 21px;
        color: #e1251b;
      }

      ol {
        padding-left: 25px;
        list-style-type: decimal;
        line-height: 24px;
        font-size: 14px;
      }

      ul {
        padding-left: 25px;
        list-style-type: disc;
        line-height: 24px;
        font-size: 14px;
      }
    }

    .checkout-steps {
      border: 1px solid #ddd;
      padding: 25px;

      .hr {
        height: 1px;
        background-color: #ddd;
      }

      .step-tit {
        line-height: 36px;
        margin: 15px 0;
      }

      .step-cont {
        margin: 0 10px 12px 20px;

        ul {
          font-size: 0;

          li {
            margin: 2px;
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ddd;
            cursor: pointer;
            line-height: 18px;
          }
        }
      }
    }

    .submit {
      text-align: center;

      .btn {
        display: inline-block;
        padding: 15px 45px;
        margin: 15px 0 10px;
        font: 18px "微软雅黑";
        font-weight: 700;
        border-radius: 0;
        background-color: #e1251b;
        border: 1px solid #e1251b;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }
    }
  }
}
</style>