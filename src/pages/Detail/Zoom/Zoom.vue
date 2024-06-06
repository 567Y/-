<template>
  <div class="spec-preview">
    <img :src="imgObj.imgUrl" />
    <div class="event" @mousemove="handler"></div>
    <div class="big" >
      <img :src="imgObj.imgUrl" ref="big" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>


<script>
  export default {
    name: "Zoom",
    data(){
      return{
        currentIndex:0
      }
    },
    props:['skuImageList'],
    mounted(){
      //定义全局事件总线 接收兄弟组件传过来的索引值(每次点击图片的下标)
      this.$bus.$on("getCurIndex",(index)=>{
        // console.log("收到了数据",index)
        //将收到的下标传给自己定义的变量
        this.currentIndex = index;
      })
    },
    computed:{
      //初始化异步数据
      //异步数据先显示初始数据，再显示带数据的数据，不初始化数据默认就是undefined 控制台就会爆出警告(虽然不会影响数据本身但是看不得警告)
      imgObj(){
        //根据动态的显示图片
        return this.skuImageList[this.currentIndex] || {}
      }
    },
    methods:{
      handler(event){
        let mask = this.$refs.mask;
        let big = this.$refs.big;
        let left = event.offsetX - mask.offsetWidth/2;
        let top = event.offsetY - mask.offsetHeight/2;

        //修改遮罩层的left和top值
        mask.style.left = left +'px';
        mask.style.top = top + 'px';
        //约束范围
        if(left <= 0) mask.style.left = 0;
        if(left >= mask.offsetWidth) mask.style.left = mask.offsetWidth+'px';
        if(top<=0) mask.style.top = 0;
        if(top >= mask.offsetHeight) mask.style.top =  mask.offsetHeight+'px';

        //修改大图的left|top值
        big.style.left = -2 * left + 'px';
        big.style.top = -2 * top + 'px'

      }
    }
   
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>